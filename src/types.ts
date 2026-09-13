export type AppView = 
  | 'home' 
  | 'camera-test' 
  | 'mic-test' 
  | 'speaker-test' 
  | 'diagnostics' 
  | 'report' 
  | 'privacy' 
  | 'history';

export interface DeviceItem {
  deviceId: string;
  label: string;
  kind: MediaDeviceKind;
  groupId: string;
}

export type QualityRating = 'Low' | 'Standard' | 'HD' | 'Full HD' | '2K' | '4K' | 'Ultra HD';

export interface ResolutionMetrics {
  width: number;
  height: number;
  aspectRatio: string;
  category: QualityRating;
}

export interface FPSMetrics {
  current: number;
  target: number;
  stability: number; // 0 - 100%
  history: number[];
}

export interface BrightnessMetrics {
  value: number; // 0 - 255
  percentage: number; // 0 - 100%
  status: 'Too Dark' | 'Good' | 'Bright' | 'Overexposed';
}

export interface SharpnessMetrics {
  score: number; // 0 - 100
  isBlurry: boolean;
  status: 'Blurry' | 'Soft' | 'Sharp' | 'Ultra Crisp';
}

export interface ExposureMetrics {
  score: number; // 0 - 100
  status: 'Underexposed' | 'Balanced' | 'Overexposed';
}

export interface ColorMetrics {
  red: number;
  green: number;
  blue: number;
  warmth: 'Cool' | 'Neutral' | 'Warm';
  balance: number; // 0 - 100%
  histogram: { r: number[]; g: number[]; b: number[] };
}

export interface FaceMetrics {
  detected: boolean;
  count: number;
  box: { x: number; y: number; width: number; height: number } | null;
  centerAlignment: number; // 0 - 100% (100 = perfectly centered)
  sizePercentage: number; // % of frame
  distanceEstimate: 'Too Close' | 'Ideal Distance' | 'Too Far' | 'Not Detected';
}

export interface LightingAdvice {
  status: 'OPTIMAL' | 'TOO_DARK' | 'BACKLIGHT' | 'OVEREXPOSED' | 'UNEVEN';
  headline: string;
  message: string;
  severity: 'success' | 'warning' | 'error';
}

export interface CameraCapabilitiesInfo {
  facingMode?: string;
  aspectRatio?: number | { min?: number; max?: number };
  frameRate?: number | { min?: number; max?: number };
  width?: number | { min?: number; max?: number };
  height?: number | { min?: number; max?: number };
  zoomSupported: boolean;
  torchSupported: boolean;
  focusSupported: boolean;
  whiteBalanceSupported: boolean;
  exposureSupported: boolean;
}

export interface AudioMetrics {
  volume: number; // 0 - 100%
  peak: number; // 0 - 100%
  average: number; // 0 - 100%
  isSilent: boolean;
  frequencyData: Uint8Array;
  timeData: Uint8Array;
}

export interface QualityScore {
  overall: number; // 0 - 100
  breakdown: {
    resolution: number;
    fps: number;
    lighting: number;
    sharpness: number;
    color: number;
    stability: number;
  };
  grade: 'A+' | 'A' | 'B' | 'C' | 'D';
}

export interface DiagnosticReportData {
  id: string;
  timestamp: number;
  dateStr: string;
  cameraName: string;
  microphoneName: string;
  overallScore: number;
  grade: string;
  resolution: string;
  fps: number;
  brightness: string;
  sharpness: number;
  exposure: string;
  colorBalance: string;
  faceDetected: boolean;
  browser: string;
  secureContext: boolean;
  permissions: {
    camera: 'granted' | 'denied' | 'prompt' | 'unsupported';
    microphone: 'granted' | 'denied' | 'prompt' | 'unsupported';
  };
  speakerTested: boolean;
  overallStatus: 'PASS' | 'WARNING' | 'FAILED';
  breakdown: QualityScore['breakdown'];
}

export interface BrowserSupport {
  cameraAPI: boolean;
  microphoneAPI: boolean;
  mediaRecorder: boolean;
  webAudio: boolean;
  canvas: boolean;
  canvas2D?: boolean;
  secureContext: boolean;
  deviceEnumeration: boolean;
  isCompatible?: boolean;
}
