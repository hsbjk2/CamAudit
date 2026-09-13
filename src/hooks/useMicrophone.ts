import { useState, useEffect, useRef, useCallback } from 'react';
import { AudioMetrics } from '../types';

export function useMicrophone() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [permissionStatus, setPermissionStatus] = useState<'prompt' | 'granted' | 'denied' | 'unsupported'>('prompt');
  const [error, setError] = useState<{ title: string; message: string } | null>(null);
  const [selectedMicId, setSelectedMicId] = useState<string>('');
  const [metrics, setMetrics] = useState<AudioMetrics>({
    volume: 0,
    peak: 0,
    average: 0,
    isSilent: true,
    frequencyData: new Uint8Array(64),
    timeData: new Uint8Array(64),
  });

  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const peakDecayRef = useRef<number>(0);
  const avgHistoryRef = useRef<number[]>([]);
  const silenceTimerRef = useRef<number>(0);
  const lastStateUpdateRef = useRef<number>(0);

  // Initial permission check
  useEffect(() => {
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'microphone' as PermissionName })
        .then((res) => {
          setPermissionStatus(res.state as 'prompt' | 'granted' | 'denied');
          res.onchange = () => setPermissionStatus(res.state as 'prompt' | 'granted' | 'denied');
        })
        .catch(() => setPermissionStatus('prompt'));
    }
  }, []);

  const stopMicrophone = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (sourceRef.current) {
      try {
        sourceRef.current.disconnect();
      } catch {
        // ignore
      }
      sourceRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close().catch(() => {});
      } catch {
        // ignore
      }
      audioContextRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    analyserRef.current = null;
    setStream(null);
    setIsActive(false);
    peakDecayRef.current = 0;
    avgHistoryRef.current = [];
    silenceTimerRef.current = 0;

    setMetrics({
      volume: 0,
      peak: 0,
      average: 0,
      isSilent: true,
      frequencyData: new Uint8Array(64),
      timeData: new Uint8Array(64),
    });
  }, []);

  const startMicrophone = useCallback(async (deviceId?: string) => {
    setError(null);
    stopMicrophone();

    if (!navigator.mediaDevices?.getUserMedia) {
      setError({
        title: 'Microphone API Not Supported',
        message: 'Your browser environment does not support Web Audio / Microphone capture.',
      });
      setPermissionStatus('unsupported');
      return;
    }

    // Pre-create/resume AudioContext immediately in user interaction thread
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    let audioCtx: AudioContext | null = null;
    try {
      audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;
      if (audioCtx.state === 'suspended') {
        await audioCtx.resume();
      }
    } catch (e) {
      console.warn('AudioContext pre-initialization notice:', e);
    }

    try {
      const targetId = deviceId && deviceId.trim().length > 0 ? deviceId.trim() : (selectedMicId ? selectedMicId.trim() : undefined);
      let newStream: MediaStream | null = null;

      if (targetId) {
        try {
          newStream = await navigator.mediaDevices.getUserMedia({
            audio: {
              deviceId: { exact: targetId },
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
            },
            video: false,
          });
        } catch (constraintErr) {
          console.warn('Exact deviceId constraint failed, falling back to default audio input', constraintErr);
          newStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false,
          });
        }
      } else {
        newStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
      }

      if (!newStream) {
        throw new Error('Failed to acquire audio stream from browser.');
      }

      streamRef.current = newStream;
      setStream(newStream);
      setIsActive(true);
      setPermissionStatus('granted');

      // Ensure AudioContext is alive
      if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
        audioContextRef.current = new AudioCtx();
      }
      audioCtx = audioContextRef.current;
      if (audioCtx.state === 'suspended') {
        await audioCtx.resume();
      }

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.75;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(newStream);
      source.connect(analyser);
      sourceRef.current = source;

      const timeBuffer = new Uint8Array(analyser.frequencyBinCount);
      const freqBuffer = new Uint8Array(analyser.frequencyBinCount);

      const updateAudio = () => {
        if (!analyserRef.current) return;

        analyserRef.current.getByteTimeDomainData(timeBuffer);
        analyserRef.current.getByteFrequencyData(freqBuffer);

        // Calculate RMS (Root Mean Square) volume
        let sumSquares = 0;
        for (let i = 0; i < timeBuffer.length; i++) {
          const normalized = (timeBuffer[i] - 128) / 128;
          sumSquares += normalized * normalized;
        }
        const rms = Math.sqrt(sumSquares / timeBuffer.length);
        // Scale to 0-100% with boost for natural speech
        const currentVol = Math.min(100, Math.round(rms * 240));

        // Peak hold & decay
        if (currentVol > peakDecayRef.current) {
          peakDecayRef.current = currentVol;
        } else {
          peakDecayRef.current = Math.max(0, peakDecayRef.current - 1.5);
        }

        // Average moving window
        avgHistoryRef.current.push(currentVol);
        if (avgHistoryRef.current.length > 20) {
          avgHistoryRef.current.shift();
        }
        const avgVol = Math.round(avgHistoryRef.current.reduce((a, b) => a + b, 0) / avgHistoryRef.current.length);

        // Silence detection threshold (< 2.5% for > 25 frames)
        if (currentVol < 2.5) {
          silenceTimerRef.current += 1;
        } else {
          silenceTimerRef.current = 0;
        }
        const isSilent = silenceTimerRef.current > 25;

        // Throttle React state updates to ~15fps (every 65ms)
        // This stops React from freezing the UI with 60 re-renders per second
        const now = performance.now();
        if (now - lastStateUpdateRef.current >= 65) {
          lastStateUpdateRef.current = now;
          setMetrics({
            volume: currentVol,
            peak: Math.round(peakDecayRef.current),
            average: avgVol,
            isSilent,
            timeData: timeBuffer.slice(),
            frequencyData: freqBuffer.slice(),
          });
        }

        animFrameRef.current = requestAnimationFrame(updateAudio);
      };

      updateAudio();
    } catch (err: unknown) {
      setIsActive(false);
      const domError = err as DOMException;
      if (domError.name === 'NotAllowedError' || domError.name === 'PermissionDeniedError') {
        setPermissionStatus('denied');
        setError({
          title: 'Microphone Permission Denied',
          message: 'Please allow microphone access in your browser address bar or site settings, then click Test Microphone again.',
        });
      } else {
        setError({
          title: 'Microphone Connection Error',
          message: domError.message || 'Could not start audio input. Ensure another program is not exclusively locking the microphone.',
        });
      }
    }
  }, [selectedMicId, stopMicrophone]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopMicrophone();
    };
  }, [stopMicrophone]);

  return {
    stream,
    isActive,
    permissionStatus,
    error,
    metrics,
    selectedMicId,
    setSelectedMicId,
    analyser: analyserRef.current,
    startMicrophone,
    stopMicrophone,
    startMic: startMicrophone,
    stopMic: stopMicrophone,
    micState: {
      stream,
      isActive,
      permissionStatus,
      error,
      metrics,
      analyser: analyserRef.current,
    },
  };
}
