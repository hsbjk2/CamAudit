import { useState, useEffect, useRef, type RefObject } from 'react';
import { 
  BrightnessMetrics, 
  SharpnessMetrics, 
  ExposureMetrics, 
  ColorMetrics, 
  LightingAdvice 
} from '../types';

export function useCameraAnalysis(
  videoRef: RefObject<HTMLVideoElement | null>,
  isActive: boolean,
  isPaused: boolean
) {
  const [brightness, setBrightness] = useState<BrightnessMetrics>({
    value: 128,
    percentage: 50,
    status: 'Good',
  });

  const [sharpness, setSharpness] = useState<SharpnessMetrics>({
    score: 85,
    isBlurry: false,
    status: 'Sharp',
  });

  const [contrast, setContrast] = useState<number>(75);

  const [exposure, setExposure] = useState<ExposureMetrics>({
    score: 80,
    status: 'Balanced',
  });

  const [color, setColor] = useState<ColorMetrics>({
    red: 33,
    green: 34,
    blue: 33,
    warmth: 'Neutral',
    balance: 92,
    histogram: {
      r: new Array(16).fill(0),
      g: new Array(16).fill(0),
      b: new Array(16).fill(0),
    },
  });

  const [lightingAdvice, setLightingAdvice] = useState<LightingAdvice>({
    status: 'OPTIMAL',
    headline: 'GOOD LIGHTING',
    message: 'Your scene is evenly illuminated with natural balanced exposure.',
    severity: 'success',
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!isActive || isPaused) return;

    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
      canvasRef.current.width = 160;
      canvasRef.current.height = 120;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const interval = setInterval(() => {
      const video = videoRef.current;
      if (!video || video.readyState < 2 || video.videoWidth === 0) return;

      const w = canvas.width;
      const h = canvas.height;

      ctx.drawImage(video, 0, 0, w, h);
      let imgData: ImageData;
      try {
        imgData = ctx.getImageData(0, 0, w, h);
      } catch (err) {
        console.warn('Canvas security restriction on frame analysis', err);
        return;
      }

      const data = imgData.data;
      const totalPixels = w * h;

      let totalLum = 0;
      let totalR = 0;
      let totalG = 0;
      let totalB = 0;

      const rHist = new Array(16).fill(0);
      const gHist = new Array(16).fill(0);
      const bHist = new Array(16).fill(0);

      const luminances = new Float32Array(totalPixels);

      // Top/back vs center sampling for backlight detection
      let centerLum = 0;
      let centerCount = 0;
      let borderLum = 0;
      let borderCount = 0;

      const centerXMin = Math.floor(w * 0.3);
      const centerXMax = Math.floor(w * 0.7);
      const centerYMin = Math.floor(h * 0.25);
      const centerYMax = Math.floor(h * 0.75);

      let underClip = 0;
      let overClip = 0;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        totalR += r;
        totalG += g;
        totalB += b;

        // Histograms (16 bins)
        rHist[Math.min(15, Math.floor(r / 16))]++;
        gHist[Math.min(15, Math.floor(g / 16))]++;
        bHist[Math.min(15, Math.floor(b / 16))]++;

        // Luminance
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        const pixelIdx = i / 4;
        luminances[pixelIdx] = lum;
        totalLum += lum;

        if (lum < 15) underClip++;
        if (lum > 240) overClip++;

        const px = pixelIdx % w;
        const py = Math.floor(pixelIdx / w);

        if (px >= centerXMin && px <= centerXMax && py >= centerYMin && py <= centerYMax) {
          centerLum += lum;
          centerCount++;
        } else {
          borderLum += lum;
          borderCount++;
        }
      }

      // 1. Average Brightness
      const avgLum = totalLum / totalPixels;
      const brightnessPct = Math.min(100, Math.round((avgLum / 255) * 100));

      let bStatus: BrightnessMetrics['status'] = 'Good';
      if (avgLum < 55) bStatus = 'Too Dark';
      else if (avgLum > 220) bStatus = 'Overexposed';
      else if (avgLum > 185) bStatus = 'Bright';

      setBrightness({
        value: Math.round(avgLum),
        percentage: brightnessPct,
        status: bStatus,
      });

      // 2. Contrast (Standard deviation of luminance)
      let sumSqDiff = 0;
      for (let j = 0; j < totalPixels; j++) {
        sumSqDiff += Math.pow(luminances[j] - avgLum, 2);
      }
      const stdDevLum = Math.sqrt(sumSqDiff / totalPixels);
      const contrastScore = Math.min(100, Math.round((stdDevLum / 64) * 100));
      setContrast(contrastScore);

      // 3. Sharpness (Fast Laplacian variance estimation)
      let laplacianSum = 0;
      let edgeCount = 0;
      // Sample inner pixels with stride 2 for efficiency
      for (let y = 2; y < h - 2; y += 2) {
        for (let x = 2; x < w - 2; x += 2) {
          const idx = y * w + x;
          const center = luminances[idx];
          const laplacian = 
            Math.abs(
              luminances[idx - 1] + 
              luminances[idx + 1] + 
              luminances[idx - w] + 
              luminances[idx + w] - 
              4 * center
            );
          laplacianSum += laplacian;
          edgeCount++;
        }
      }
      const avgLaplacian = edgeCount > 0 ? laplacianSum / edgeCount : 0;
      const rawSharpness = Math.min(100, Math.round(avgLaplacian * 4.5));
      const sharpnessScore = Math.max(10, rawSharpness);
      const isBlurry = sharpnessScore < 42;
      
      let sharpnessStatus: SharpnessMetrics['status'] = 'Sharp';
      if (sharpnessScore >= 88) sharpnessStatus = 'Ultra Crisp';
      else if (sharpnessScore >= 60) sharpnessStatus = 'Sharp';
      else if (sharpnessScore >= 42) sharpnessStatus = 'Soft';
      else sharpnessStatus = 'Blurry';

      setSharpness({
        score: sharpnessScore,
        isBlurry,
        status: sharpnessStatus,
      });

      // 4. Exposure
      const underClipPct = (underClip / totalPixels) * 100;
      const overClipPct = (overClip / totalPixels) * 100;
      let exposureStatus: ExposureMetrics['status'] = 'Balanced';
      let exposureScore = 85;

      if (overClipPct > 18 || avgLum > 215) {
        exposureStatus = 'Overexposed';
        exposureScore = Math.max(20, Math.round(100 - overClipPct * 3));
      } else if (underClipPct > 28 || avgLum < 50) {
        exposureStatus = 'Underexposed';
        exposureScore = Math.max(20, Math.round(100 - underClipPct * 2.5));
      } else {
        exposureScore = Math.min(98, Math.round(100 - (underClipPct + overClipPct) * 1.5));
      }

      setExposure({
        score: exposureScore,
        status: exposureStatus,
      });

      // 5. Color distribution & Warmth
      const sumRGB = totalR + totalG + totalB || 1;
      const rRatio = totalR / sumRGB;
      const gRatio = totalG / sumRGB;
      const bRatio = totalB / sumRGB;

      const rPct = Math.round(rRatio * 100);
      const gPct = Math.round(gRatio * 100);
      const bPct = Math.round(bRatio * 100);

      let warmth: ColorMetrics['warmth'] = 'Neutral';
      if (rRatio - bRatio > 0.08) warmth = 'Warm';
      else if (bRatio - rRatio > 0.08) warmth = 'Cool';

      const colorBalanceScore = Math.max(20, Math.round(100 - Math.abs(rRatio - 0.33) * 180 - Math.abs(gRatio - 0.33) * 180));

      setColor({
        red: rPct,
        green: gPct,
        blue: bPct,
        warmth,
        balance: colorBalanceScore,
        histogram: {
          r: rHist.map((v) => Math.round((v / totalPixels) * 100)),
          g: gHist.map((v) => Math.round((v / totalPixels) * 100)),
          b: bHist.map((v) => Math.round((v / totalPixels) * 100)),
        },
      });

      // 6. Intelligent Lighting Assistant Logic
      const avgCenter = centerCount > 0 ? centerLum / centerCount : avgLum;
      const avgBorder = borderCount > 0 ? borderLum / borderCount : avgLum;

      if (avgLum < 50) {
        setLightingAdvice({
          status: 'TOO_DARK',
          headline: 'TOO DARK',
          message: 'Move toward a light source or turn on a desk lamp to improve clarity.',
          severity: 'error',
        });
      } else if (avgLum > 220 || overClipPct > 20) {
        setLightingAdvice({
          status: 'OVEREXPOSED',
          headline: 'OVEREXPOSED',
          message: 'Lower harsh direct illumination or adjust camera exposure settings.',
          severity: 'warning',
        });
      } else if (avgBorder > avgCenter + 45 && avgBorder > 130 && avgCenter < 100) {
        setLightingAdvice({
          status: 'BACKLIGHT',
          headline: 'BACKLIGHT DETECTED',
          message: 'Avoid placing a bright window or bright background light directly behind you.',
          severity: 'warning',
        });
      } else if (Math.abs(avgCenter - avgBorder) > 60) {
        setLightingAdvice({
          status: 'UNEVEN',
          headline: 'UNEVEN ILLUMINATION',
          message: 'Consider placing a balanced key light in front of your face for even distribution.',
          severity: 'warning',
        });
      } else {
        setLightingAdvice({
          status: 'OPTIMAL',
          headline: 'GOOD LIGHTING',
          message: 'Your face is well illuminated with natural balanced exposure.',
          severity: 'success',
        });
      }
    }, 280);

    return () => {
      clearInterval(interval);
    };
  }, [isActive, isPaused, videoRef]);

  return {
    brightness,
    sharpness,
    contrast,
    contrastScore: contrast,
    exposure,
    color,
    lightingAdvice,
  };
}
