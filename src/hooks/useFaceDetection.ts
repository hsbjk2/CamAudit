import { useState, useEffect, useRef, type RefObject } from 'react';
import { FaceMetrics } from '../types';

interface NativeDetectedFace {
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

interface NativeFaceDetector {
  detect: (image: ImageBitmapSource) => Promise<NativeDetectedFace[]>;
}

declare global {
  interface Window {
    FaceDetector?: new (options?: { fastMode?: boolean; maxDetectedFaces?: number }) => NativeFaceDetector;
  }
}

export function useFaceDetection(
  videoRef: RefObject<HTMLVideoElement | null>,
  isActive: boolean,
  isPaused: boolean
) {
  const [faceMetrics, setFaceMetrics] = useState<FaceMetrics>({
    detected: false,
    count: 0,
    box: null,
    centerAlignment: 0,
    sizePercentage: 0,
    distanceEstimate: 'Not Detected',
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const nativeDetectorRef = useRef<NativeFaceDetector | null>(null);
  
  // Temporal stabilization ref
  const smoothedBoxRef = useRef<{ x: number; y: number; width: number; height: number } | null>(null);
  const missCountRef = useRef<number>(0);

  // Initialize native detector if supported
  useEffect(() => {
    if (typeof window !== 'undefined' && window.FaceDetector) {
      try {
        nativeDetectorRef.current = new window.FaceDetector({ fastMode: true, maxDetectedFaces: 2 });
      } catch (err) {
        console.warn('Native FaceDetector initialization failed, using adaptive vision engine', err);
      }
    }
  }, []);

  useEffect(() => {
    if (!isActive || isPaused) {
      smoothedBoxRef.current = null;
      missCountRef.current = 0;
      setFaceMetrics({
        detected: false,
        count: 0,
        box: null,
        centerAlignment: 0,
        sizePercentage: 0,
        distanceEstimate: 'Not Detected',
      });
      return;
    }

    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
      canvasRef.current.width = 160;
      canvasRef.current.height = 120;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    let isRunning = true;

    const runDetection = async () => {
      const video = videoRef.current;
      if (!video || video.readyState < 2 || video.videoWidth === 0) return;

      const vw = video.videoWidth;
      const vh = video.videoHeight;

      // 1. Try Native FaceDetector API first
      if (nativeDetectorRef.current) {
        try {
          const detectedFaces = await nativeDetectorRef.current.detect(video);
          if (!isRunning) return;

          if (detectedFaces && detectedFaces.length > 0) {
            const face = detectedFaces[0].boundingBox;
            const rawX = Math.max(0, Math.min(100, (face.x / vw) * 100));
            const rawY = Math.max(0, Math.min(100, (face.y / vh) * 100));
            const rawW = Math.max(10, Math.min(80, (face.width / vw) * 100));
            const rawH = Math.max(12, Math.min(90, (face.height / vh) * 100));

            // Temporal smoothing
            let curBox = smoothedBoxRef.current;
            if (!curBox) {
              curBox = { x: rawX, y: rawY, width: rawW, height: rawH };
            } else {
              curBox = {
                x: curBox.x * 0.65 + rawX * 0.35,
                y: curBox.y * 0.65 + rawY * 0.35,
                width: curBox.width * 0.65 + rawW * 0.35,
                height: curBox.height * 0.65 + rawH * 0.35,
              };
            }
            smoothedBoxRef.current = curBox;
            missCountRef.current = 0;

            const faceCenterX = curBox.x + curBox.width / 2;
            const faceCenterY = curBox.y + curBox.height / 2;
            const offX = Math.abs(faceCenterX - 50);
            const offY = Math.abs(faceCenterY - 45);
            const centerAlignment = Math.max(0, Math.min(100, Math.round(100 - (offX * 1.5 + offY * 1.2))));

            const sizePct = Math.round(curBox.width);
            let distance: FaceMetrics['distanceEstimate'] = 'Ideal Distance';
            if (sizePct > 42) distance = 'Too Close';
            else if (sizePct < 16) distance = 'Too Far';

            setFaceMetrics({
              detected: true,
              count: detectedFaces.length,
              box: { ...curBox },
              centerAlignment,
              sizePercentage: sizePct,
              distanceEstimate: distance,
            });
            return;
          }
        } catch {
          // Native detector error, fall through to adaptive vision engine
        }
      }

      // 2. High-Precision Adaptive Vision Engine
      const cw = canvas.width;
      const ch = canvas.height;
      ctx.drawImage(video, 0, 0, cw, ch);

      let imgData: ImageData;
      try {
        imgData = ctx.getImageData(0, 0, cw, ch);
      } catch {
        return;
      }

      const data = imgData.data;

      // Create a 16x12 cell density grid (each cell is 10x10 pixels = 100 pixels)
      const cols = 16;
      const rows = 12;
      const cellW = 10;
      const cellH = 10;
      const grid = new Float32Array(cols * rows);

      for (let rIdx = 0; rIdx < rows; rIdx++) {
        for (let cIdx = 0; cIdx < cols; cIdx++) {
          let skinCount = 0;
          const startX = cIdx * cellW;
          const startY = rIdx * cellH;

          // Step by 2 for high performance
          for (let py = startY; py < startY + cellH; py += 2) {
            for (let px = startX; px < startX + cellW; px += 2) {
              const idx = (py * cw + px) * 4;
              const r = data[idx];
              const g = data[idx + 1];
              const b = data[idx + 2];

              const sum = r + g + b;
              if (sum < 35 || sum > 740) continue; // Exclude pure pitch black and saturated white

              // Inclusive Normalized RGB and YCbCr Chrominance model
              const rNorm = r / sum;
              const gNorm = g / sum;

              const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
              const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;

              // Supports Fitzpatrick phototypes I to VI across various white balance temperatures
              const isSkinNormRGB = r > g && r > b && rNorm > 0.33 && rNorm < 0.65 && gNorm > 0.22 && gNorm < 0.40;
              const isSkinYCbCr = cb >= 68 && cb <= 142 && cr >= 125 && cr <= 188;

              if (isSkinNormRGB || isSkinYCbCr) {
                skinCount++;
              }
            }
          }

          // Sampled 25 pixels per cell
          grid[rIdx * cols + cIdx] = skinCount / 25;
        }
      }

      // Find the peak face cluster in the natural portrait area (rows 1..8, cols 2..13)
      let maxDensity = 0;
      let peakCol = -1;
      let peakRow = -1;

      for (let rIdx = 1; rIdx <= 8; rIdx++) {
        for (let cIdx = 2; cIdx <= 13; cIdx++) {
          const density = grid[rIdx * cols + cIdx];
          // Center-bias weighting: human face is expected near upper center
          const distFromCenter = Math.abs(cIdx - 7.5) * 0.03 + Math.abs(rIdx - 4) * 0.04;
          const weightedDensity = density - distFromCenter;
          if (weightedDensity > maxDensity) {
            maxDensity = weightedDensity;
            peakCol = cIdx;
            peakRow = rIdx;
          }
        }
      }

      let detectedFace = false;
      let rawX = 0;
      let rawY = 0;
      let rawW = 0;
      let rawH = 0;

      // If a prominent facial cluster was identified
      if (maxDensity >= 0.25 && peakCol >= 0 && peakRow >= 0) {
        // Expand connected cluster around the peak
        let minCol = peakCol;
        let maxCol = peakCol;
        let minRow = peakRow;
        let maxRow = peakRow;

        // Expand horizontally
        while (minCol > 0 && grid[peakRow * cols + (minCol - 1)] >= 0.15) minCol--;
        while (maxCol < cols - 1 && grid[peakRow * cols + (maxCol + 1)] >= 0.15) maxCol++;

        // Expand vertically
        while (minRow > 0 && grid[(minRow - 1) * cols + peakCol] >= 0.15) minRow--;
        // For vertical down-expansion, cap to avoid bleeding into chest/torso
        while (maxRow < Math.min(rows - 1, peakRow + 5) && grid[(maxRow + 1) * cols + peakCol] >= 0.18) maxRow++;

        const clusterW = (maxCol - minCol + 1) * cellW;
        const clusterH = (maxRow - minRow + 1) * cellH;
        const aspect = clusterH / Math.max(1, clusterW);

        // Anthropomorphic facial proportions (aspect ratio typically 0.85 to 1.85)
        if (aspect >= 0.8 && aspect <= 2.2 && clusterW >= 18 && clusterH >= 20) {
          rawX = Math.max(2, Math.min(85, (minCol * cellW / cw) * 100));
          rawY = Math.max(2, Math.min(80, (minRow * cellH / ch) * 100));
          rawW = Math.max(14, Math.min(70, (clusterW / cw) * 100));
          rawH = Math.max(18, Math.min(80, (clusterH / ch) * 100));
          detectedFace = true;
        }
      }

      if (detectedFace) {
        // Smooth exponential moving average
        let curBox = smoothedBoxRef.current;
        if (!curBox) {
          curBox = { x: rawX, y: rawY, width: rawW, height: rawH };
        } else {
          curBox = {
            x: curBox.x * 0.7 + rawX * 0.3,
            y: curBox.y * 0.7 + rawY * 0.3,
            width: curBox.width * 0.7 + rawW * 0.3,
            height: curBox.height * 0.7 + rawH * 0.3,
          };
        }
        smoothedBoxRef.current = curBox;
        missCountRef.current = 0;

        const faceCenterX = curBox.x + curBox.width / 2;
        const faceCenterY = curBox.y + curBox.height / 2;
        const offX = Math.abs(faceCenterX - 50);
        const offY = Math.abs(faceCenterY - 45);
        const centerAlignment = Math.max(0, Math.min(100, Math.round(100 - (offX * 1.5 + offY * 1.2))));

        const sizePct = Math.round(curBox.width);
        let distance: FaceMetrics['distanceEstimate'] = 'Ideal Distance';
        if (sizePct > 42) distance = 'Too Close';
        else if (sizePct < 16) distance = 'Too Far';

        setFaceMetrics({
          detected: true,
          count: 1,
          box: { ...curBox },
          centerAlignment,
          sizePercentage: sizePct,
          distanceEstimate: distance,
        });
      } else {
        // Hysteresis: retain previous detection for up to 3 missed cycles to eliminate flicker
        if (smoothedBoxRef.current && missCountRef.current < 3) {
          missCountRef.current++;
        } else {
          smoothedBoxRef.current = null;
          missCountRef.current = 0;
          setFaceMetrics({
            detected: false,
            count: 0,
            box: null,
            centerAlignment: 0,
            sizePercentage: 0,
            distanceEstimate: 'Not Detected',
          });
        }
      }
    };

    const interval = setInterval(runDetection, 250);

    return () => {
      isRunning = false;
      clearInterval(interval);
    };
  }, [isActive, isPaused, videoRef]);

  return faceMetrics;
}

