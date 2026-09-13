import { Camera, Monitor, Activity, Sun, Mic, Volume2, Sliders, CheckCircle2 } from 'lucide-react';
import { AppView } from '../types';

interface FeatureShowcaseProps {
  onNavigate?: (view: AppView) => void;
  onOpenTool?: (toolId: string) => void;
}

export function FeatureShowcase({ onNavigate, onOpenTool }: FeatureShowcaseProps) {
  const features = [
    {
      id: 'camera',
      icon: <Camera className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />,
      title: 'Camera & Optical Feed',
      category: 'OPTICAL SUBSYSTEM',
      description: 'Full-spectrum video capture analysis with instant hardware switching, mirroring, frame freezing, and lossless snapshot export.',
      targetView: 'camera-test' as AppView,
      metric: 'Real-time Feed',
      keyFeatures: [
        'Live WebRTC Video Stream with Mirroring',
        'HD Frame Freezing & Instant Snapshot PNG',
        'Hardware WebM Video Recording & Playback',
        'Real-time Face Alignment & Frame Coverage'
      ],
      badgeColor: 'bg-cyan-100 dark:bg-cyan-950/70 text-cyan-800 dark:text-cyan-300 border-cyan-300 dark:border-cyan-500/30'
    },
    {
      id: 'mic',
      icon: <Mic className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
      title: 'Microphone & Oscilloscope',
      category: 'ACOUSTIC INPUT',
      description: 'Real-time audio signal auditing using Web Audio API Fast Fourier Transform (FFT) with peak volume and background noise detection.',
      targetView: 'mic-test' as AppView,
      metric: 'Live Audio FFT',
      keyFeatures: [
        'Real-time Oscilloscope Waveform Visualizer',
        'RMS Volume & Peak Decibel Level Meter',
        'Background Noise Floor & Silence Profiler',
        'Multi-Mic Input Hardware Selector'
      ],
      badgeColor: 'bg-purple-100 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-500/30'
    },
    {
      id: 'speaker',
      icon: <Volume2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      title: 'Speaker & Spatial Audio',
      category: 'STEREO OUTPUT',
      description: 'Auditory frequency generator with discrete Left and Right channel separation using Web Audio StereoPannerNode.',
      targetView: 'speaker-test' as AppView,
      metric: 'Stereo L / R Split',
      keyFeatures: [
        'True Left-Channel Isolated Pure Sine Wave',
        'True Right-Channel Isolated Pure Sine Wave',
        'Multi-Frequency Tones (250Hz, 440Hz, 1kHz, 4kHz)',
        'Stereo Panning Sweep & Spatial Balance Check'
      ],
      badgeColor: 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/30'
    },
    {
      id: 'resolution',
      icon: <Monitor className="w-5 h-5 text-sky-600 dark:text-sky-400" />,
      title: 'Resolution & Sensor Probing',
      category: 'SENSOR SPECIFICATION',
      description: 'Active resolution detection and sensor probing across 4K Ultra HD (2160p), 1080p Full HD, 720p HD, and standard 480p.',
      targetView: 'camera-test' as AppView,
      metric: 'Up to 4K UHD',
      keyFeatures: [
        'Active Pixel Width & Height Detection',
        'True Aspect Ratio Calculation (16:9, 4:3, 1:1)',
        'Resolution Tier Classification (4K, FHD, HD)',
        'Optimal Bandwidth & Conferencing Match'
      ],
      badgeColor: 'bg-sky-100 dark:bg-sky-950/70 text-sky-800 dark:text-sky-300 border-sky-300 dark:border-sky-500/30'
    },
    {
      id: 'fps',
      icon: <Activity className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
      title: 'FPS & Lighting Analysis',
      category: 'PERFORMANCE & EXPOSURE',
      description: 'Sub-millisecond frame delivery rate analysis paired with automated luminance, edge sharpness, and backlight detection.',
      targetView: 'diagnostics' as AppView,
      metric: '30 / 60 FPS Gauge',
      keyFeatures: [
        'Rolling 60-Second Real-Time Frame Rate Meter',
        'Frame Jitter & Render Stability Percentage',
        'Laplacian Edge Sharpness & Focus Metric',
        'Automated Backlight & Glare Advisory System'
      ],
      badgeColor: 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-400 border-amber-300 dark:border-amber-500/30'
    },
    {
      id: 'hardware',
      icon: <Sliders className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
      title: 'Hardware & Browser Audit',
      category: 'SYSTEM INTEGRITY',
      description: 'Comprehensive device capability inspection verifying HTML5 MediaTrackCapabilities, security sandboxing, and browser compliance.',
      targetView: 'diagnostics' as AppView,
      metric: 'Hardware Audit',
      keyFeatures: [
        'Optical / Digital Zoom Driver Detection',
        'Torch & Mobile Flash LED Availability',
        'HTTPS Sandboxed Secure Context Validation',
        'Downloadable Comprehensive PDF Health Report'
      ],
      badgeColor: 'bg-teal-100 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300 border-teal-300 dark:border-teal-500/30'
    },
  ];

  return (
    <section className="py-16 border-t border-slate-200 dark:border-white/8 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-950/60 border border-cyan-300 dark:border-cyan-500/25 text-cyan-800 dark:text-cyan-300 text-xs font-mono-tech uppercase mb-3">
            <span>SPECIFIC DIAGNOSTIC CAPABILITIES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white tracking-tight mb-4">
            Next-Generation Hardware Diagnostics
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Engineered with deep browser-native diagnostics to inspect every pixel, audio frame, sensor capability, and stereo playback channel with zero software installs.
          </p>
        </div>

        {/* 6 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat) => (
            <div
              key={feat.id}
              className="p-6 rounded-2xl glass-panel border border-slate-200/80 dark:border-white/8 flex flex-col justify-between shadow-sm transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 flex items-center justify-center shadow-sm">
                    {feat.icon}
                  </div>
                  <span className={`text-[10px] font-mono-tech px-2 py-0.5 rounded border ${feat.badgeColor}`}>
                    {feat.metric}
                  </span>
                </div>

                <div className="text-[11px] font-mono-tech font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  {feat.category}
                </div>

                <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white mb-2">
                  {feat.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  {feat.description}
                </p>

                {/* Specific feature bullet points */}
                <div className="space-y-1.5 pt-3 border-t border-slate-200/80 dark:border-white/5 mb-4">
                  {feat.keyFeatures.map((kf, kfIdx) => (
                    <div key={kfIdx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-sans">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                      <span className="truncate">{kf}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200/80 dark:border-white/5 flex items-center justify-between text-[11px] font-mono-tech text-slate-500 dark:text-slate-400">
                <span>AUDIT SPECIFICATION</span>
                <span className="text-cyan-600 dark:text-cyan-400 font-medium">{feat.metric}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

