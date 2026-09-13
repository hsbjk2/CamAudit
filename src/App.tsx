import { useState, useMemo, useEffect } from 'react';
import { 
  AppView, 
  DiagnosticReportData,
} from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CameraPreview } from './components/CameraPreview';
import { CameraCapabilities } from './components/CameraCapabilities';
import { PermissionsPanel } from './components/PermissionsPanel';
import { MicrophoneTester } from './components/MicrophoneTester';
import { SpeakerTester } from './components/SpeakerTester';
import { HealthScore } from './components/HealthScore';
import { ReportPanel } from './components/ReportPanel';
import { TestHistory } from './components/TestHistory';
import { PrivacyPanel } from './components/PrivacyPanel';
import { FeatureShowcase } from './components/FeatureShowcase';
import { BrowserCompatibility } from './components/BrowserCompatibility';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { RecordingModal } from './components/RecordingModal';
import { ScreenshotModal } from './components/ScreenshotModal';
import { ProjectOverview } from './components/ProjectOverview';
import { DiagnosticStandards } from './components/DiagnosticStandards';

// Diagnostic sub-components
import { FPSMeter } from './components/diagnostics/FPSMeter';
import { ResolutionCard } from './components/diagnostics/ResolutionCard';
import { BrightnessMeter } from './components/diagnostics/BrightnessMeter';
import { SharpnessMeter } from './components/diagnostics/SharpnessMeter';
import { ExposureMeter } from './components/diagnostics/ExposureMeter';
import { ColorAnalyzer } from './components/diagnostics/ColorAnalyzer';
import { FaceMetricsCard } from './components/diagnostics/FaceMetricsCard';
import { LightingAssistant } from './components/diagnostics/LightingAssistant';

// Hooks
import { useDeviceList } from './hooks/useDeviceList';
import { useCamera } from './hooks/useCamera';
import { useFPS } from './hooks/useFPS';
import { useCameraAnalysis } from './hooks/useCameraAnalysis';
import { useFaceDetection } from './hooks/useFaceDetection';
import { useMicrophone } from './hooks/useMicrophone';
import { useSpeakerTest } from './hooks/useSpeakerTest';
import { useRecording } from './hooks/useRecording';
import { useScreenshot } from './hooks/useScreenshot';
import { useBrowserCheck } from './hooks/useBrowserCheck';

// Storage & Score Utils
import { 
  calculateQualityScore, 
  loadHistory, 
  saveReportToHistory, 
  clearHistory 
} from './utils/storageAndScore';
import { Camera, RefreshCw } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [history, setHistory] = useState<DiagnosticReportData[]>([]);
  const [activeReport, setActiveReport] = useState<DiagnosticReportData | null>(null);

  // Theme Management (Dark / Light Mode)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('camaudit_theme');
      if (saved === 'light' || saved === 'dark') return saved;
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        return 'light';
      }
    }
    return 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
    }
    localStorage.setItem('camaudit_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Initialize browser check and device enumeration
  const browserSupport = useBrowserCheck();
  const { cameras, microphones, cameraPermission, micPermission, refreshDevices } = useDeviceList();

  // Camera stream and metrics
  const {
    videoRef,
    stream,
    isActive: isCameraActive,
    isPaused,
    isMirrored,
    selectedCameraId,
    resolution,
    capabilities,
    error: cameraError,
    startCamera,
    stopCamera,
    togglePause,
    toggleMirror,
    switchCamera,
    updateResolutionFromVideo,
  } = useCamera();

  // Real-time analysis hooks
  const fps = useFPS(videoRef, isCameraActive, isPaused);
  const analysis = useCameraAnalysis(videoRef, isCameraActive, isPaused);
  const faceMetrics = useFaceDetection(videoRef, isCameraActive, isPaused);

  // Microphone and Audio Hooks
  const {
    micState,
    startMic,
    stopMic,
    selectedMicId,
    setSelectedMicId,
    analyser,
  } = useMicrophone();

  // Initialize default microphone when device list is populated
  useEffect(() => {
    if (microphones.length > 0 && !selectedMicId) {
      setSelectedMicId(microphones[0].deviceId);
    }
  }, [microphones, selectedMicId, setSelectedMicId]);

  // Speaker Testing Hook
  const {
    activeChannel,
    hasTested: speakerTested,
    playTone,
    stopActiveTone,
    volume: speakerVolume,
    setVolume: setSpeakerVolume,
  } = useSpeakerTest();

  // Recording & Screenshot
  const {
    isRecording,
    duration: recordingDuration,
    recordedVideoUrl,
    startRecording,
    stopRecording,
    clearRecording,
  } = useRecording(stream);

  const {
    photoUrl,
    timestamp: photoTimestamp,
    capture: captureScreenshot,
    clearScreenshot,
    downloadScreenshot,
  } = useScreenshot(videoRef, isMirrored);

  // Load history on mount
  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  // Compute overall quality score dynamically
  const qualityScore = useMemo(() => {
    return calculateQualityScore(
      resolution,
      fps,
      analysis.brightness,
      analysis.sharpness,
      analysis.color,
      analysis.exposure
    );
  }, [resolution, fps, analysis]);

  // Handler for Generating a new Diagnostic Report
  const handleGenerateReport = () => {
    const selectedCam = cameras.find(c => c.deviceId === selectedCameraId);
    const selectedMic = microphones.find(m => m.deviceId === selectedMicId);

    const newReport: DiagnosticReportData = {
      id: `CAM-${Date.now().toString(36).toUpperCase()}`,
      timestamp: Date.now(),
      dateStr: new Date().toLocaleDateString(undefined, { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      cameraName: selectedCam?.label || (isCameraActive ? 'Integrated HD Camera' : 'Offline / Standby'),
      microphoneName: selectedMic?.label || (micState.isActive ? 'Active Microphone' : 'Default Input'),
      speakerTested,
      browser: `${browserSupport.support.secureContext ? 'Secure HTTPS' : 'Insecure'} • ${browserSupport.browserName}`,
      secureContext: browserSupport.support.secureContext,
      permissions: {
        camera: cameraPermission,
        microphone: micPermission,
      },
      resolution: resolution.width ? `${resolution.width} × ${resolution.height}` : 'Not Detected',
      fps: fps.current,
      brightness: `${analysis.brightness.percentage}% (${analysis.brightness.status})`,
      sharpness: analysis.sharpness.score,
      exposure: `${analysis.exposure.score}/100 (${analysis.exposure.status})`,
      colorBalance: `${analysis.color.warmth} Tone (${analysis.color.balance}%)`,
      faceDetected: faceMetrics.detected,
      overallScore: qualityScore.overall,
      grade: qualityScore.grade,
      breakdown: qualityScore.breakdown,
      overallStatus: qualityScore.overall >= 80 ? 'PASS' : qualityScore.overall >= 55 ? 'WARNING' : 'FAILED',
    };

    saveReportToHistory(newReport);
    setHistory(loadHistory());
    setActiveReport(newReport);
    setCurrentView('report');
  };

  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
  };

  const handleNavigate = (view: AppView) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col app-canvas bg-slate-50 dark:bg-[#030712] text-slate-900 dark:text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-600 dark:selection:text-cyan-200 transition-colors duration-200">
      
      {/* 1. Global Navigation Bar */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onStartTesting={() => {
          handleNavigate('camera-test');
          if (!isCameraActive) startCamera();
        }}
        isCameraActive={isCameraActive}
        isDarkMode={theme === 'dark'}
        onToggleTheme={toggleTheme}
      />

      {/* 2. Main View Routing */}
      <main className="flex-1">
        {/* VIEW: HOME */}
        {currentView === 'home' && (
          <div>
            <Hero
              onStartTesting={() => {
                handleNavigate('camera-test');
                if (!isCameraActive) startCamera();
              }}
              onCheckMicrophone={() => {
                handleNavigate('mic-test');
                if (!micState.isActive) startMic(selectedMicId);
              }}
              onExploreDiagnostics={() => handleNavigate('diagnostics')}
            />

            {/* Project Overview, Architecture, & Pipeline Details */}
            <ProjectOverview onNavigate={handleNavigate} />

            {/* Diagnostic Standards & Telecommunication Criteria */}
            <DiagnosticStandards />

            {/* Feature Showcase Grid */}
            <FeatureShowcase onNavigate={handleNavigate} />

            {/* Browser Capabilities Check */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <BrowserCompatibility support={browserSupport.support} />
            </div>

            {/* Privacy Guarantee Center */}
            <PrivacyPanel />

            {/* FAQ Accordion */}
            <FAQ />
          </div>
        )}

        {/* VIEW: CAMERA TEST */}
        {currentView === 'camera-test' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
                  Camera Diagnostic Suite
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  High-resolution optical feed, face alignment tracking, and live telemetry
                </p>
              </div>

              {/* Camera Switcher */}
              <div className="flex items-center gap-3">
                {cameras.length > 0 && (
                  <select
                    id="camera-select-suite"
                    value={selectedCameraId}
                    onChange={(e) => switchCamera(e.target.value)}
                    className="text-xs font-mono-tech bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-400 cursor-pointer"
                  >
                    {cameras.map((c) => (
                      <option key={c.deviceId} value={c.deviceId}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                )}

                <button
                  onClick={() => refreshDevices()}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                  title="Refresh Connected Devices"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 space-y-6">
                <CameraPreview
                  videoRef={videoRef}
                  isActive={isCameraActive}
                  isPaused={isPaused}
                  isMirrored={isMirrored}
                  resolution={resolution}
                  fps={fps}
                  faceMetrics={faceMetrics}
                  isRecording={isRecording}
                  recordingDuration={recordingDuration}
                  error={cameraError}
                  onStartCamera={() => startCamera(selectedCameraId || undefined)}
                  onStopCamera={stopCamera}
                  onTogglePause={togglePause}
                  onToggleMirror={toggleMirror}
                  onCaptureScreenshot={captureScreenshot}
                  onStartRecording={startRecording}
                  onStopRecording={stopRecording}
                  onLoadedMetadata={updateResolutionFromVideo}
                />

                <LightingAssistant advice={analysis.lightingAdvice} />

                <CameraCapabilities
                  capabilities={capabilities}
                  resolution={resolution}
                  fps={fps}
                />
              </div>

              <div className="lg:col-span-4 space-y-4">
                <FPSMeter fps={fps} />
                <ResolutionCard resolution={resolution} />
                <BrightnessMeter brightness={analysis.brightness} />
                <SharpnessMeter sharpness={analysis.sharpness} />
                <ExposureMeter exposure={analysis.exposure} contrastScore={analysis.contrastScore} />
                <ColorAnalyzer color={analysis.color} />
                <FaceMetricsCard face={faceMetrics} />
              </div>
            </div>

            <HealthScore score={qualityScore} onGenerateReport={handleGenerateReport} />
          </div>
        )}

        {/* VIEW: MICROPHONE TEST */}
        {currentView === 'mic-test' && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
                Microphone Signal Audit
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Real-time Web Audio API signal processing, noise threshold, and oscilloscope analysis
              </p>
            </div>

            <MicrophoneTester
              microphones={microphones}
              selectedMicId={selectedMicId}
              onSelectMic={setSelectedMicId}
              isActive={micState.isActive}
              permissionStatus={micPermission}
              error={micState.error}
              metrics={micState.metrics}
              analyser={analyser}
              onStartMic={startMic}
              onStopMic={stopMic}
            />

            <PermissionsPanel
              cameraPermission={cameraPermission}
              micPermission={micPermission}
              browserSupport={browserSupport.support}
              onRequestCamera={startCamera}
              onRequestMic={() => startMic()}
            />
          </div>
        )}

        {/* VIEW: SPEAKER TEST */}
        {currentView === 'speaker-test' && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
                Speaker & Auditory Spatial Test
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Synthesize isolated left and right stereo audio tones to ensure balanced playback
              </p>
            </div>

            <SpeakerTester
              activeChannel={activeChannel}
              hasTested={speakerTested}
              onPlayTone={playTone}
              onStopTone={stopActiveTone}
              volume={speakerVolume}
              onVolumeChange={setSpeakerVolume}
            />
          </div>
        )}

        {/* VIEW: COMPLETE DIAGNOSTICS */}
        {currentView === 'diagnostics' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
                  Comprehensive Hardware Diagnostics
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Full-spectrum optical, auditory, and browser runtime capabilities breakdown
                </p>
              </div>

              <button
                id="diagnostics-view-report-btn"
                onClick={handleGenerateReport}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-300 hover:from-cyan-300 hover:to-sky-200 transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
              >
                <span>Export Diagnostic Report</span>
              </button>
            </div>

            <HealthScore score={qualityScore} onGenerateReport={handleGenerateReport} />

            {/* Diagnostic Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FPSMeter fps={fps} />
              <ResolutionCard resolution={resolution} />
              <BrightnessMeter brightness={analysis.brightness} />
              <SharpnessMeter sharpness={analysis.sharpness} />
              <ExposureMeter exposure={analysis.exposure} contrastScore={analysis.contrastScore} />
              <ColorAnalyzer color={analysis.color} />
              <FaceMetricsCard face={faceMetrics} />
              <div className="md:col-span-2">
                <LightingAssistant advice={analysis.lightingAdvice} />
              </div>
            </div>

            {/* Spatial Speaker Audio Test in Complete Diagnostics */}
            <SpeakerTester
              activeChannel={activeChannel}
              hasTested={speakerTested}
              onPlayTone={playTone}
              onStopTone={stopActiveTone}
              volume={speakerVolume}
              onVolumeChange={setSpeakerVolume}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CameraCapabilities
                capabilities={capabilities}
                resolution={resolution}
                fps={fps}
              />
              <MicrophoneTester
                microphones={microphones}
                selectedMicId={selectedMicId}
                onSelectMic={setSelectedMicId}
                isActive={micState.isActive}
                permissionStatus={micPermission}
                error={micState.error}
                metrics={micState.metrics}
                analyser={analyser}
                onStartMic={startMic}
                onStopMic={stopMic}
              />
            </div>

            <PermissionsPanel
              cameraPermission={cameraPermission}
              micPermission={micPermission}
              browserSupport={browserSupport.support}
              onRequestCamera={startCamera}
              onRequestMic={() => startMic()}
            />

            <BrowserCompatibility support={browserSupport.support} />
          </div>
        )}

        {/* VIEW: DIAGNOSTIC REPORT */}
        {currentView === 'report' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {activeReport ? (
              <ReportPanel
                report={activeReport}
                onBack={() => handleNavigate('diagnostics')}
              />
            ) : (
              <div className="py-16 text-center">
                <p className="text-slate-500 dark:text-slate-400 mb-4">No report selected.</p>
                <button
                  onClick={handleGenerateReport}
                  className="px-4 py-2 rounded-xl bg-cyan-400 text-slate-950 text-sm font-semibold cursor-pointer shadow-md shadow-cyan-500/20"
                >
                  Generate Current Audit Report
                </button>
              </div>
            )}
          </div>
        )}

        {/* VIEW: TEST HISTORY */}
        {currentView === 'history' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
                Local Audit History
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Past diagnostic evaluations stored strictly in browser localStorage
              </p>
            </div>

            <TestHistory
              history={history}
              onSelectReport={(rep) => {
                setActiveReport(rep);
                setCurrentView('report');
              }}
              onClearHistory={handleClearHistory}
            />
          </div>
        )}

        {/* VIEW: PRIVACY */}
        {currentView === 'privacy' && (
          <div className="py-8">
            <PrivacyPanel />
            <FAQ />
          </div>
        )}
      </main>

      {/* 3. Global Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* 4. Modals */}
      <RecordingModal
        videoUrl={recordedVideoUrl}
        duration={recordingDuration}
        onClose={clearRecording}
      />

      <ScreenshotModal
        photoUrl={photoUrl}
        timestamp={photoTimestamp}
        onClose={clearScreenshot}
        onDownload={downloadScreenshot}
        onRetake={captureScreenshot}
      />
    </div>
  );
}
