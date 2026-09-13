import { useRef, useState, type RefObject } from 'react';
import { 
  Camera, 
  CameraOff, 
  Play, 
  Pause, 
  FlipHorizontal, 
  Maximize, 
  Minimize, 
  Disc, 
  Square, 
  Camera as CameraIcon, 
  UserCheck, 
  UserX, 
  RefreshCw, 
  AlertCircle 
} from 'lucide-react';
import { ResolutionMetrics, FPSMetrics, FaceMetrics } from '../types';

interface CameraPreviewProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  isActive: boolean;
  isPaused: boolean;
  isMirrored: boolean;
  resolution: ResolutionMetrics;
  fps: FPSMetrics;
  faceMetrics: FaceMetrics;
  isRecording: boolean;
  recordingDuration: number;
  error: { title: string; message: string } | null;
  onStartCamera: () => void;
  onStopCamera: () => void;
  onTogglePause: () => void;
  onToggleMirror: () => void;
  onCaptureScreenshot: () => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onLoadedMetadata: () => void;
}

export function CameraPreview({
  videoRef,
  isActive,
  isPaused,
  isMirrored,
  resolution,
  fps,
  faceMetrics,
  isRecording,
  recordingDuration,
  error,
  onStartCamera,
  onStopCamera,
  onTogglePause,
  onToggleMirror,
  onCaptureScreenshot,
  onStartRecording,
  onStopRecording,
  onLoadedMetadata,
}: CameraPreviewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showFramingGuide, setShowFramingGuide] = useState<boolean>(true);

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      try {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } catch (err) {
        console.warn('Fullscreen request denied', err);
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-video rounded-2xl overflow-hidden glass-panel keep-dark border border-cyan-500/20 shadow-2xl bg-[#030712] flex items-center justify-center select-none"
    >
      {/* 1. Actual Video Element */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        onLoadedMetadata={onLoadedMetadata}
        className={`w-full h-full object-cover transition-transform duration-200 ${
          isMirrored ? '-scale-x-100' : 'scale-x-100'
        } ${isActive ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* Subtle Scanline Overlay Effect */}
      {isActive && !isPaused && (
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-cyan-400/[0.03] to-transparent h-24 animate-scanline" />
      )}

      {/* 2. Inactive / Stopped State Placeholder */}
      {!isActive && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-950/90 z-20">
          <div className="w-20 h-20 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center mb-4 text-cyan-400 shadow-lg shadow-cyan-500/10">
            <Camera className="w-9 h-9" />
          </div>
          <h3 className="text-xl font-display font-bold text-white mb-2">Camera is Offline</h3>
          <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
            Click below to initialize your webcam stream and run comprehensive optical diagnostics locally in your browser.
          </p>
          <button
            id="camera-preview-activate-btn"
            onClick={() => onStartCamera()}
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl font-semibold text-sm text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-300 hover:from-cyan-300 hover:to-sky-200 transition-all shadow-lg shadow-cyan-500/25 cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            <span>Enable Camera Stream</span>
          </button>
        </div>
      )}

      {/* 3. Error Alert Overlay */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-950/95 z-25">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mb-4 text-rose-400 shadow-lg shadow-rose-500/10">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-display font-bold text-rose-300 mb-2">{error.title}</h3>
          <p className="text-sm text-slate-300 max-w-md mb-6 leading-relaxed">
            {error.message}
          </p>
          <button
            id="camera-preview-retry-btn"
            onClick={() => onStartCamera()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-slate-800 hover:bg-slate-700 border border-slate-600 transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 text-cyan-400" />
            <span>Retry Camera</span>
          </button>
        </div>
      )}

      {/* 4. Paused State Watermark */}
      {isActive && isPaused && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm z-15 pointer-events-none">
          <div className="px-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-cyan-300 font-mono-tech text-xs tracking-wider flex items-center gap-2">
            <Pause className="w-4 h-4" />
            <span>VIDEO PREVIEW PAUSED</span>
          </div>
        </div>
      )}

      {/* 5. Futuristic Face Framing Guide Overlay */}
      {isActive && !isPaused && showFramingGuide && faceMetrics.detected && faceMetrics.box && (
        <div 
          className="absolute border border-cyan-400/70 rounded-xl transition-all duration-150 pointer-events-none z-10"
          style={{
            left: `${isMirrored ? 100 - (faceMetrics.box.x + faceMetrics.box.width) : faceMetrics.box.x}%`,
            top: `${faceMetrics.box.y}%`,
            width: `${faceMetrics.box.width}%`,
            height: `${faceMetrics.box.height}%`,
            boxShadow: '0 0 15px rgba(6, 182, 212, 0.25)',
          }}
        >
          {/* Cybernetic Corner Reticles */}
          <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-cyan-300" />
          <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-cyan-300" />
          <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-cyan-300" />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-cyan-300" />

          {/* Center Target Point */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-400/80" />

          {/* Floating Target Telemetry Header */}
          <div className="absolute -top-6 left-0 bg-slate-950/90 border border-cyan-500/40 text-[10px] font-mono-tech text-cyan-300 px-1.5 py-0.5 rounded flex items-center gap-1">
            <span>TARGET_FACE: {faceMetrics.centerAlignment}% ALIGNED</span>
          </div>
        </div>
      )}

      {/* 6. Floating Status Indicators (Top Overlay) */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-20">
        {/* Left Telemetry Group */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Active indicator */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-md border border-white/10 text-[11px] font-mono-tech font-medium text-slate-200">
            <span className={`w-2 h-2 rounded-full ${isActive ? (isPaused ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse') : 'bg-rose-500'}`} />
            <span>{isActive ? (isPaused ? 'Paused' : 'Camera Active') : 'Standby'}</span>
          </div>

          {/* Face Detection badge */}
          {isActive && (
            <div className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-md border border-white/10 text-[11px] font-mono-tech ${
              faceMetrics.detected ? 'text-cyan-300 border-cyan-500/30' : 'text-slate-400'
            }`}>
              {faceMetrics.detected ? (
                <>
                  <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Face Detected ✓</span>
                </>
              ) : (
                <>
                  <UserX className="w-3.5 h-3.5 text-slate-500" />
                  <span>No Face Detected</span>
                </>
              )}
            </div>
          )}

          {/* Recording Timer Badge */}
          {isRecording && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-950/85 backdrop-blur-md border border-rose-500/40 text-[11px] font-mono-tech text-rose-300 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>REC {formatTimer(recordingDuration)}</span>
            </div>
          )}
        </div>

        {/* Right Telemetry Group: Resolution, FPS, Ratio, Color Mode */}
        {isActive && (
          <div className="hidden md:flex items-center gap-2 font-mono-tech text-[11px] text-slate-300">
            <div className="px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-md border border-white/10">
              <span className="text-slate-500 mr-1">RES:</span>
              <span className="text-cyan-300 font-medium">
                {resolution.width ? `${resolution.width} × ${resolution.height}` : 'Detecting...'}
              </span>
            </div>

            <div className="px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-md border border-white/10">
              <span className="text-slate-500 mr-1">FPS:</span>
              <span className="text-emerald-300 font-medium">{fps.current} FPS</span>
            </div>

            <div className="px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-md border border-white/10">
              <span className="text-slate-500 mr-1">RATIO:</span>
              <span>{resolution.aspectRatio}</span>
            </div>

            <div className="px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-md border border-white/10">
              <span className="text-slate-500 mr-1">COLOR:</span>
              <span>RGB</span>
            </div>
          </div>
        )}
      </div>

      {/* 7. Bottom Control Bar Overlay */}
      {isActive && (
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between p-2 rounded-xl bg-slate-950/85 backdrop-blur-xl border border-white/10 z-20 shadow-2xl">
          {/* Left Controls: Start/Stop/Pause */}
          <div className="flex items-center gap-1.5">
            <button
              id="cam-ctrl-stop-btn"
              onClick={onStopCamera}
              className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/25 transition-colors cursor-pointer"
              title="Stop Camera"
              aria-label="Stop Camera"
            >
              <CameraOff className="w-4 h-4" />
            </button>

            <button
              id="cam-ctrl-pause-btn"
              onClick={onTogglePause}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                isPaused 
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-white/10'
              }`}
              title={isPaused ? 'Resume Preview' : 'Pause Preview'}
              aria-label={isPaused ? 'Resume Preview' : 'Pause Preview'}
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </button>

            <button
              id="cam-ctrl-mirror-btn"
              onClick={onToggleMirror}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                isMirrored 
                  ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' 
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-white/10'
              }`}
              title="Toggle Mirror View"
              aria-label="Toggle Mirror View"
            >
              <FlipHorizontal className="w-4 h-4" />
            </button>

            <button
              id="cam-ctrl-guide-toggle-btn"
              onClick={() => setShowFramingGuide(!showFramingGuide)}
              className={`hidden sm:inline-flex px-2.5 py-1.5 rounded-lg border text-xs font-mono-tech transition-colors cursor-pointer ${
                showFramingGuide 
                  ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' 
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-400 border-white/10'
              }`}
              title="Toggle Face Framing Reticle"
            >
              RETICLE
            </button>
          </div>

          {/* Center Action Buttons: Screenshot & Video Recording */}
          <div className="flex items-center gap-2">
            <button
              id="cam-ctrl-screenshot-btn"
              onClick={onCaptureScreenshot}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-medium border border-white/10 shadow transition-colors cursor-pointer"
              title="Capture High-Res Photo"
            >
              <CameraIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span>Snapshot</span>
            </button>

            {!isRecording ? (
              <button
                id="cam-ctrl-start-record-btn"
                onClick={onStartRecording}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600/90 hover:bg-rose-500 text-white text-xs font-semibold shadow-md shadow-rose-600/20 transition-all cursor-pointer"
                title="Record Video Clip"
              >
                <Disc className="w-3.5 h-3.5 animate-spin" />
                <span>Record</span>
              </button>
            ) : (
              <button
                id="cam-ctrl-stop-record-btn"
                onClick={onStopRecording}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md shadow-rose-600/30 transition-all animate-pulse cursor-pointer"
                title="Stop Recording"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Stop</span>
              </button>
            )}
          </div>

          {/* Right Controls: Fullscreen */}
          <div className="flex items-center gap-1.5">
            <button
              id="cam-ctrl-fullscreen-btn"
              onClick={toggleFullscreen}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-white/10 transition-colors cursor-pointer"
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
