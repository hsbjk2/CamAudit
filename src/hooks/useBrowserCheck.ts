import { useState, useEffect } from 'react';
import { BrowserSupport } from '../types';

export function useBrowserCheck() {
  const [support, setSupport] = useState<BrowserSupport>({
    cameraAPI: false,
    microphoneAPI: false,
    mediaRecorder: false,
    webAudio: false,
    canvas: false,
    secureContext: false,
    deviceEnumeration: false,
  });

  const [browserName, setBrowserName] = useState<string>('Unknown Browser');

  useEffect(() => {
    const hasGetUserMedia = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    const hasAudioCtx = typeof window !== 'undefined' && (!!window.AudioContext || !!(window as unknown as { webkitAudioContext: unknown }).webkitAudioContext);
    const hasMediaRecorder = typeof MediaRecorder !== 'undefined';
    const hasCanvas = typeof document !== 'undefined' && !!document.createElement('canvas').getContext;
    const isSecure = typeof window !== 'undefined' && !!window.isSecureContext;
    const hasEnumerate = !!(navigator.mediaDevices && navigator.mediaDevices.enumerateDevices);
    const compatible = hasGetUserMedia && hasAudioCtx && hasCanvas && isSecure;

    setSupport({
      cameraAPI: hasGetUserMedia,
      microphoneAPI: hasGetUserMedia,
      mediaRecorder: hasMediaRecorder,
      webAudio: hasAudioCtx,
      canvas: hasCanvas,
      canvas2D: hasCanvas,
      secureContext: isSecure,
      deviceEnumeration: hasEnumerate,
      isCompatible: compatible,
    });

    // Detect browser name
    if (typeof navigator !== 'undefined') {
      const ua = navigator.userAgent;
      if (ua.includes('Edg/')) setBrowserName('Microsoft Edge');
      else if (ua.includes('Chrome/')) setBrowserName('Google Chrome');
      else if (ua.includes('Safari/') && !ua.includes('Chrome/')) setBrowserName('Apple Safari');
      else if (ua.includes('Firefox/')) setBrowserName('Mozilla Firefox');
      else if (ua.includes('OPR/') || ua.includes('Opera/')) setBrowserName('Opera');
      else setBrowserName('Modern Web Browser');
    }
  }, []);

  const isFullyCompatible = 
    support.cameraAPI && 
    support.microphoneAPI && 
    support.canvas && 
    support.webAudio && 
    support.secureContext;

  return {
    support,
    browserName,
    isFullyCompatible,
  };
}
