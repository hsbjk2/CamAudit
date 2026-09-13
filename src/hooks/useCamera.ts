import { useState, useEffect, useRef, useCallback } from 'react';
import { ResolutionMetrics, CameraCapabilitiesInfo, QualityRating } from '../types';

export function getResolutionCategory(width: number, height: number): QualityRating {
  const pixels = width * height;
  if (pixels >= 3840 * 2160 * 0.75) return '4K';
  if (pixels >= 2560 * 1440 * 0.75) return '2K';
  if (pixels >= 1920 * 1080 * 0.75) return 'Full HD';
  if (pixels >= 1280 * 720 * 0.75) return 'HD';
  if (pixels >= 854 * 480 * 0.75) return 'Standard';
  return 'Low';
}

export function calculateAspectRatio(width: number, height: number): string {
  if (!width || !height) return '16:9';
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(width, height);
  const w = width / divisor;
  const h = height / divisor;
  
  // Normalize close ratios
  const ratio = width / height;
  if (Math.abs(ratio - 16 / 9) < 0.05) return '16:9';
  if (Math.abs(ratio - 4 / 3) < 0.05) return '4:3';
  if (Math.abs(ratio - 1) < 0.05) return '1:1';
  if (Math.abs(ratio - 9 / 16) < 0.05) return '9:16';
  
  return `${w}:${h}`;
}

export function useCamera() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isMirrored, setIsMirrored] = useState<boolean>(true);
  const [permissionStatus, setPermissionStatus] = useState<'prompt' | 'granted' | 'denied' | 'unsupported'>('prompt');
  const [error, setError] = useState<{ title: string; message: string } | null>(null);
  const [selectedResolution, setSelectedResolution] = useState<'max' | '1080p' | '720p' | '480p'>('max');
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');
  
  const [resolution, setResolution] = useState<ResolutionMetrics>({
    width: 0,
    height: 0,
    aspectRatio: '16:9',
    category: 'HD',
  });

  const [capabilities, setCapabilities] = useState<CameraCapabilitiesInfo>({
    zoomSupported: false,
    torchSupported: false,
    focusSupported: false,
    whiteBalanceSupported: false,
    exposureSupported: false,
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Check initial permission query if supported
  useEffect(() => {
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'camera' as PermissionName })
        .then((result) => {
          setPermissionStatus(result.state);
          result.onchange = () => {
            setPermissionStatus(result.state);
          };
        })
        .catch(() => {
          // Some browsers like Safari or Firefox may not support camera in permissions.query
          setPermissionStatus('prompt');
        });
    }
  }, []);

  // Ensure video element always has current stream attached
  useEffect(() => {
    if (videoRef.current && stream) {
      if (videoRef.current.srcObject !== stream) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch((err) => {
          console.warn('Video autoplay deferred:', err);
        });
      }
    }
  }, [stream]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
    setIsPaused(false);
  }, [stream]);

  const startCamera = useCallback(async (deviceIdInput?: string | unknown) => {
    setError(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setError({
        title: 'Camera Not Supported',
        message: 'Your browser or environment does not support the WebRTC Camera Media API.',
      });
      setPermissionStatus('unsupported');
      return;
    }

    // Stop current stream if running
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    // Sanitize deviceId - ignore React SyntheticEvent objects or invalid strings
    const targetDeviceId = 
      typeof deviceIdInput === 'string' && deviceIdInput.trim().length > 0 && deviceIdInput !== '[object Object]'
        ? deviceIdInput.trim()
        : (typeof selectedCameraId === 'string' && selectedCameraId ? selectedCameraId : undefined);

    let constraints: MediaStreamConstraints = {
      video: {
        deviceId: targetDeviceId ? { ideal: targetDeviceId } : undefined,
        width: selectedResolution === '1080p' ? { ideal: 1920 } :
               selectedResolution === '720p' ? { ideal: 1280 } :
               selectedResolution === '480p' ? { ideal: 640 } :
               { ideal: 1920 },
        height: selectedResolution === '1080p' ? { ideal: 1080 } :
                selectedResolution === '720p' ? { ideal: 720 } :
                selectedResolution === '480p' ? { ideal: 480 } :
                { ideal: 1080 },
        frameRate: { ideal: 30 },
      },
      audio: false,
    };

    try {
      let newStream: MediaStream;
      try {
        newStream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (firstErr) {
        console.warn('Initial camera constraints failed, attempting fallback to loose constraints', firstErr);
        try {
          // Fallback Tier 1: Relaxed video with ideal deviceId
          const fallbackConstraints1: MediaStreamConstraints = {
            video: targetDeviceId ? { deviceId: { ideal: targetDeviceId } } : true,
            audio: false,
          };
          newStream = await navigator.mediaDevices.getUserMedia(fallbackConstraints1);
        } catch (secondErr) {
          console.warn('Fallback tier 1 failed, attempting minimal video: true constraint', secondErr);
          // Fallback Tier 2: Absolute baseline video
          newStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        }
      }

      setStream(newStream);
      setIsActive(true);
      setIsPaused(false);
      setPermissionStatus('granted');

      const videoTrack = newStream.getVideoTracks()[0];
      if (videoTrack) {
        // Inspect capabilities
        if ('getCapabilities' in videoTrack && typeof videoTrack.getCapabilities === 'function') {
          try {
            const caps = videoTrack.getCapabilities() as unknown as Record<string, unknown>;
            setCapabilities({
              facingMode: Array.isArray(caps.facingMode) ? caps.facingMode.join(', ') : undefined,
              aspectRatio: caps.aspectRatio as number | undefined,
              frameRate: caps.frameRate as number | undefined,
              zoomSupported: 'zoom' in caps,
              torchSupported: 'torch' in caps,
              focusSupported: 'focusMode' in caps,
              whiteBalanceSupported: 'whiteBalanceMode' in caps,
              exposureSupported: 'exposureMode' in caps || 'exposureCompensation' in caps,
            });
          } catch (capErr) {
            console.warn('Could not read track capabilities', capErr);
          }
        }

        // Settings
        const settings = videoTrack.getSettings();
        if (settings.width && settings.height) {
          const cat = getResolutionCategory(settings.width, settings.height);
          const ratio = calculateAspectRatio(settings.width, settings.height);
          setResolution({
            width: settings.width,
            height: settings.height,
            aspectRatio: ratio,
            category: cat,
          });
        }
      }

      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        videoRef.current.play().catch((playErr) => console.warn('Video play prevented', playErr));
      }
    } catch (err: unknown) {
      setIsActive(false);
      const domError = err as DOMException;
      if (domError.name === 'NotAllowedError' || domError.name === 'PermissionDeniedError') {
        setPermissionStatus('denied');
        setError({
          title: 'Camera Access Blocked',
          message: 'Camera permission was denied. Click the camera or site settings icon in your browser address bar to allow camera access, then click Retry.',
        });
      } else if (domError.name === 'NotFoundError' || domError.name === 'DevicesNotFoundError') {
        setError({
          title: 'No Camera Detected',
          message: 'No physical or virtual camera was detected on this device. Please connect a webcam and retry.',
        });
      } else if (domError.name === 'NotReadableError' || domError.name === 'TrackStartError') {
        setError({
          title: 'Camera Busy',
          message: 'Your webcam is currently locked by another application (Zoom, Teams, Discord, etc.) or system privacy switch.',
        });
      } else if (domError.name === 'OverconstrainedError') {
        setError({
          title: 'Hardware Constraint Error',
          message: 'Your webcam does not support the requested resolution or framerate mode.',
        });
      } else {
        setError({
          title: 'Camera Connection Failed',
          message: domError.message || 'An unexpected issue occurred while requesting camera access.',
        });
      }
    }
  }, [selectedResolution, stream, selectedCameraId]);

  // Video loadedmetadata listener to update resolution
  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) {
      const w = videoRef.current.videoWidth;
      const h = videoRef.current.videoHeight;
      if (w && h) {
        const cat = getResolutionCategory(w, h);
        const ratio = calculateAspectRatio(w, h);
        setResolution({
          width: w,
          height: h,
          aspectRatio: ratio,
          category: cat,
        });
      }
    }
  }, []);

  const togglePause = useCallback(() => {
    if (!stream) return;
    const tracks = stream.getVideoTracks();
    if (tracks.length > 0) {
      const newPaused = !isPaused;
      tracks[0].enabled = !newPaused;
      setIsPaused(newPaused);
    }
  }, [stream, isPaused]);

  const toggleMirror = useCallback(() => {
    setIsMirrored((prev) => !prev);
  }, []);

  const switchCamera = useCallback((deviceId: string) => {
    setSelectedCameraId(deviceId);
    if (isActive) {
      startCamera(deviceId);
    }
  }, [isActive, startCamera]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  return {
    stream,
    isActive,
    isPaused,
    isMirrored,
    permissionStatus,
    resolution,
    capabilities,
    error,
    videoRef,
    selectedResolution,
    setSelectedResolution,
    selectedCameraId,
    setSelectedCameraId,
    startCamera,
    stopCamera,
    switchCamera,
    togglePause,
    toggleMirror,
    handleLoadedMetadata,
    updateResolutionFromVideo: handleLoadedMetadata,
  };
}
