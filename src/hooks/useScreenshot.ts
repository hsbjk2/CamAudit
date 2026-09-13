import { useState, useCallback, type RefObject } from 'react';

export function useScreenshot(
  videoRef: RefObject<HTMLVideoElement | null>,
  isMirrored: boolean
) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [timestamp, setTimestamp] = useState<string>('');

  const capturePhoto = useCallback(() => {
    const video = videoRef.current;
    if (!video || video.readyState < 2 || video.videoWidth === 0) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (isMirrored) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/png');
    setPhotoUrl(dataUrl);
    setTimestamp(new Date().toLocaleTimeString());
  }, [videoRef, isMirrored]);

  const clearPhoto = useCallback(() => {
    setPhotoUrl(null);
    setTimestamp('');
  }, []);

  const downloadPhoto = useCallback(() => {
    if (!photoUrl) return;
    const a = document.createElement('a');
    a.href = photoUrl;
    a.download = `camaudit-capture-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [photoUrl]);

  return {
    photoUrl,
    timestamp,
    capturePhoto,
    clearPhoto,
    downloadPhoto,
    capture: capturePhoto,
    clearScreenshot: clearPhoto,
    downloadScreenshot: downloadPhoto,
  };
}
