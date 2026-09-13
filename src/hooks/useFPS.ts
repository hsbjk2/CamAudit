import { useState, useEffect, useRef, type RefObject } from 'react';
import { FPSMetrics } from '../types';

type VideoWithCallback = HTMLVideoElement & {
  requestVideoFrameCallback?: (callback: (now: DOMHighResTimeStamp, metadata: unknown) => void) => number;
  cancelVideoFrameCallback?: (handle: number) => void;
};

export function useFPS(
  videoRef: RefObject<HTMLVideoElement | null>, 
  isActive: boolean, 
  isPaused: boolean = false
) {
  const [fpsMetrics, setFpsMetrics] = useState<FPSMetrics>({
    current: 0,
    target: 30,
    stability: 100,
    history: [30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
  });

  const frameTimesRef = useRef<number[]>([]);
  const lastTimeRef = useRef<number>(performance.now());
  const historyRef = useRef<number[]>([30, 30, 30, 30, 30, 30, 30, 30, 30, 30]);

  useEffect(() => {
    if (!isActive || isPaused || !videoRef.current) {
      setFpsMetrics((prev) => ({ ...prev, current: 0 }));
      frameTimesRef.current = [];
      return;
    }

    let isRunning = true;
    let videoCallbackHandle: number | null = null;
    let animFrameHandle: number | null = null;

    const videoEl = videoRef.current as VideoWithCallback;
    const supportsVideoCallback = typeof videoEl.requestVideoFrameCallback === 'function';

    const onFrame = (now: DOMHighResTimeStamp) => {
      if (!isRunning) return;

      const delta = now - lastTimeRef.current;
      lastTimeRef.current = now;

      if (delta > 0 && delta < 500) {
        frameTimesRef.current.push(delta);
        if (frameTimesRef.current.length > 30) {
          frameTimesRef.current.shift();
        }
      }

      if (supportsVideoCallback && videoEl.requestVideoFrameCallback) {
        videoCallbackHandle = videoEl.requestVideoFrameCallback(onFrame);
      } else {
        animFrameHandle = requestAnimationFrame(onFrame);
      }
    };

    lastTimeRef.current = performance.now();
    if (supportsVideoCallback && videoEl.requestVideoFrameCallback) {
      videoCallbackHandle = videoEl.requestVideoFrameCallback(onFrame);
    } else {
      animFrameHandle = requestAnimationFrame(onFrame);
    }

    // Interval to calculate aggregated FPS every 400ms
    const interval = setInterval(() => {
      if (frameTimesRef.current.length < 2) return;

      const deltas = frameTimesRef.current;
      const avgDelta = deltas.reduce((a, b) => a + b, 0) / deltas.length;
      const rawFps = avgDelta > 0 ? 1000 / avgDelta : 0;
      const roundedFps = Math.min(120, Math.round(rawFps));

      // Calculate variance / stability
      const variance = deltas.reduce((sum, d) => sum + Math.pow(d - avgDelta, 2), 0) / deltas.length;
      const stdDev = Math.sqrt(variance);
      // Stability: 0 - 100%
      const stability = Math.max(10, Math.min(100, Math.round(100 - (stdDev / (avgDelta || 1)) * 50)));

      // Estimate target (24, 30, 60, 120)
      let target = 30;
      if (roundedFps > 48) target = 60;
      else if (roundedFps < 26 && roundedFps > 20) target = 24;

      historyRef.current.push(roundedFps);
      if (historyRef.current.length > 20) {
        historyRef.current.shift();
      }

      setFpsMetrics({
        current: roundedFps,
        target,
        stability,
        history: [...historyRef.current],
      });
    }, 400);

    return () => {
      isRunning = false;
      clearInterval(interval);
      if (videoCallbackHandle !== null && videoEl.cancelVideoFrameCallback) {
        videoEl.cancelVideoFrameCallback(videoCallbackHandle);
      }
      if (animFrameHandle !== null) {
        cancelAnimationFrame(animFrameHandle);
      }
    };
  }, [isActive, isPaused, videoRef]);

  return fpsMetrics;
}
