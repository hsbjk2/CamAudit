import { useState, useEffect, useCallback } from 'react';
import { DeviceItem } from '../types';

export function useDeviceList() {
  const [cameras, setCameras] = useState<DeviceItem[]>([]);
  const [microphones, setMicrophones] = useState<DeviceItem[]>([]);
  const [speakers, setSpeakers] = useState<DeviceItem[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');
  const [selectedMicId, setSelectedMicId] = useState<string>('');
  const [hasPermissionLabels, setHasPermissionLabels] = useState<boolean>(false);
  const [cameraPermission, setCameraPermission] = useState<'prompt' | 'granted' | 'denied' | 'unsupported'>('prompt');
  const [micPermission, setMicPermission] = useState<'prompt' | 'granted' | 'denied' | 'unsupported'>('prompt');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'camera' as PermissionName })
        .then((res) => {
          setCameraPermission(res.state);
          res.onchange = () => setCameraPermission(res.state);
        })
        .catch(() => {});
      navigator.permissions.query({ name: 'microphone' as PermissionName })
        .then((res) => {
          setMicPermission(res.state);
          res.onchange = () => setMicPermission(res.state);
        })
        .catch(() => {});
    }
  }, []);

  const refreshDevices = useCallback(async () => {
    if (!navigator.mediaDevices?.enumerateDevices) {
      setError('Media device enumeration is not supported by your browser.');
      return;
    }

    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      
      const videoDevices: DeviceItem[] = [];
      const audioInputDevices: DeviceItem[] = [];
      const audioOutputDevices: DeviceItem[] = [];

      let hasLabels = false;

      devices.forEach((device, index) => {
        if (device.label) hasLabels = true;
        
        if (device.kind === 'videoinput') {
          videoDevices.push({
            deviceId: device.deviceId,
            label: device.label || `Camera ${videoDevices.length + 1}`,
            kind: device.kind,
            groupId: device.groupId,
          });
        } else if (device.kind === 'audioinput') {
          audioInputDevices.push({
            deviceId: device.deviceId,
            label: device.label || `Microphone ${audioInputDevices.length + 1}`,
            kind: device.kind,
            groupId: device.groupId,
          });
        } else if (device.kind === 'audiooutput') {
          audioOutputDevices.push({
            deviceId: device.deviceId,
            label: device.label || `Speaker ${audioOutputDevices.length + 1}`,
            kind: device.kind,
            groupId: device.groupId,
          });
        }
      });

      setCameras(videoDevices);
      setMicrophones(audioInputDevices);
      setSpeakers(audioOutputDevices);
      setHasPermissionLabels(hasLabels);

      // Default selection if not already selected
      if (videoDevices.length > 0 && !selectedCameraId) {
        setSelectedCameraId(videoDevices[0].deviceId);
      }
      if (audioInputDevices.length > 0 && !selectedMicId) {
        setSelectedMicId(audioInputDevices[0].deviceId);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to enumerate devices';
      setError(message);
    }
  }, [selectedCameraId, selectedMicId]);

  useEffect(() => {
    refreshDevices();

    const handleDeviceChange = () => {
      refreshDevices();
    };

    navigator.mediaDevices?.addEventListener('devicechange', handleDeviceChange);
    return () => {
      navigator.mediaDevices?.removeEventListener('devicechange', handleDeviceChange);
    };
  }, [refreshDevices]);

  return {
    cameras,
    microphones,
    speakers,
    selectedCameraId,
    setSelectedCameraId,
    selectedMicId,
    setSelectedMicId,
    hasPermissionLabels,
    cameraPermission,
    micPermission,
    refreshDevices,
    error,
  };
}
