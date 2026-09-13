import React from 'react';
import { 
  Cpu, 
  ShieldCheck, 
  Zap, 
  Layers, 
  Binary, 
  Gauge, 
  Eye, 
  Mic, 
  Volume2, 
  FileText, 
  Workflow, 
  CheckCircle2, 
  ArrowRight,
  ServerOff,
  Video,
  Radio
} from 'lucide-react';
import { AppView } from '../types';

interface ProjectOverviewProps {
  onNavigate?: (view: AppView) => void;
}

export const ProjectOverview: React.FC<ProjectOverviewProps> = () => {
  const architecturalPillars = [
    {
      icon: <ServerOff className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      title: 'Zero-Server Architecture',
      subtitle: '100% Client-Side Runtime',
      description: 'Every byte of video, microphone audio, and diagnostic telemetry is computed strictly inside your browser sandbox. No frames or audio recordings ever touch external servers.',
      techBadge: 'WebRTC getUserMedia'
    },
    {
      icon: <Zap className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />,
      title: 'Sub-Millisecond Telemetry',
      subtitle: 'Real-Time Hardware Probing',
      description: 'Calculates active pixel resolution, framerate stability, photometric luminance histograms, and Laplacian sharpness filters at 60 frames per second with near-zero overhead.',
      techBadge: 'HTML5 Canvas Convolution'
    },
    {
      icon: <Radio className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
      title: 'Digital Signal Processing (DSP)',
      subtitle: 'Acoustic & Spatial Engine',
      description: 'Web Audio API AnalyserNode executes 2048-point Fast Fourier Transforms (FFT) for real-time oscilloscope waveforms, RMS decibels, and discrete L/R stereo spatial isolation.',
      techBadge: 'Web Audio API DSP'
    },
    {
      icon: <FileText className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
      title: 'Enterprise Health Audit',
      subtitle: 'Verifiable Hardware Reports',
      description: 'Synthesizes optical and acoustic telemetry into weighted letter grades (A+ to F), generating downloadable, print-ready PDF audit reports formatted for IT compliance.',
      techBadge: 'Client-Side PDF Engine'
    }
  ];

  const projectModules = [
    {
      title: 'Camera Diagnostic Suite',
      view: 'camera-test' as AppView,
      icon: <Video className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />,
      category: 'OPTICAL SUBSYSTEM',
      description: 'High-resolution sensor probing, active aspect ratio determination, face framing coverage, snapshot extraction, and hardware WebM recording.',
      details: [
        'Real-time WebRTC camera feed with live mirroring and pause freeze-frame',
        'Hardware MediaTrackCapabilities querying for zoom, exposure, and focus',
        'Lossless PNG screenshot capture and downloadable video recording',
        'Dual-axis face tracking with centering percentage and viewport coverage'
      ]
    },
    {
      title: 'Microphone & Oscilloscope',
      view: 'mic-test' as AppView,
      icon: <Mic className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
      category: 'ACOUSTIC INPUT',
      description: 'Comprehensive acoustic analysis evaluating microphone sensitivity, background noise floor, frequency distribution, and clipping alerts.',
      details: [
        'Continuous 60 FPS oscilloscope visualizer rendered on HTML5 Canvas',
        'Accurate decibel (dBFS) volume meter with peak hold tracking',
        'Ambient noise floor baseline profiling to detect fan/room hum',
        'Multi-microphone input device enumeration and instant hot-switching'
      ]
    },
    {
      title: 'Speaker & Spatial Audio Test',
      view: 'speaker-test' as AppView,
      icon: <Volume2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      category: 'STEREO OUTPUT',
      description: 'Studio-grade audio tone generator with discrete ChannelMerger and StereoPanner channel routing to detect speaker phase distortion or silence.',
      details: [
        'Hardwired Left-channel isolated pure sine wave tone (0dB Left / -∞dB Right)',
        'Hardwired Right-channel isolated pure sine wave tone (0dB Right / -∞dB Left)',
        'Four selectable diagnostic frequencies (250Hz, 440Hz, 1000Hz, 4000Hz)',
        'Automated spatial balance sweep with real-time stereo VU meters'
      ]
    },
    {
      title: 'Deep Hardware & Metrics',
      view: 'diagnostics' as AppView,
      icon: <Gauge className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
      category: 'TELEMETRY & SENSORS',
      description: 'Full mathematical breakdown of video quality, including rolling FPS jitter, photometric luminance percentages, and Laplacian sharpness.',
      details: [
        'Rolling 60-second frame rate timeline and rendering stability percentage',
        'Photometric luminance histogram with automatic over/underexposure alerts',
        'Discrete 3x3 Laplacian edge convolution matrix calculating focus score',
        'Color balance and warmth analysis detecting artificial lighting tints'
      ]
    }
  ];

  const pipelineSteps = [
    {
      step: '01',
      title: 'Device Enumeration & Handshake',
      description: 'Queries navigator.mediaDevices to safely enumerate connected video input, audio input, and audio output devices without triggering tracking flags.',
      icon: <Binary className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
    },
    {
      step: '02',
      title: 'MediaStream Negotiation',
      description: 'Negotiates optimal constraints (ideal 1080p, 60fps) and acquires hardware handles via sandboxed browser permissions.',
      icon: <Workflow className="w-4 h-4 text-purple-600 dark:text-purple-400" />
    },
    {
      step: '03',
      title: 'Canvas & DSP Analysis Loop',
      description: 'Offscreen canvas renders video frames for Laplacian spatial filtering while Web Audio API passes PCM samples through an FFT AnalyserNode.',
      icon: <Cpu className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
    },
    {
      step: '04',
      title: 'Aggregate Health Grading',
      description: 'Synthesizes metrics across 6 dimensions into a weighted score (0–100) and produces cryptographic audit certificates locally.',
      icon: <Gauge className="w-4 h-4 text-amber-600 dark:text-amber-400" />
    }
  ];

  return (
    <div className="space-y-16 py-12">
      {/* 1. Project Mission & High-Level Architecture */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-950/60 border border-cyan-300 dark:border-cyan-500/25 text-cyan-800 dark:text-cyan-300 text-xs font-mono-tech uppercase mb-3 shadow-sm">
            <Layers className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>PROJECT SPECIFICATION & ARCHITECTURE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white tracking-tight mb-4">
            The CamAudit Diagnostic Architecture
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            CamAudit is a full-spectrum, browser-native hardware verification suite engineered to test and validate audio-visual equipment for remote work, teleconferencing, content creation, and enterprise IT compliance.
          </p>
        </div>

        {/* 4 Architectural Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {architecturalPillars.map((pillar, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl glass-panel border border-slate-200/80 dark:border-white/8 flex flex-col justify-between shadow-sm"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 flex items-center justify-center mb-4 shadow-sm">
                  {pillar.icon}
                </div>
                <span className="text-[10px] font-mono-tech uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                  {pillar.subtitle}
                </span>
                <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white mb-2">
                  {pillar.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  {pillar.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200/80 dark:border-white/5">
                <span className="text-[10px] font-mono-tech px-2 py-1 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 block text-center">
                  {pillar.techBadge}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. End-to-End Processing Pipeline */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl glass-panel border border-slate-200/80 dark:border-white/8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-mono-tech text-cyan-600 dark:text-cyan-400 font-semibold uppercase tracking-wider block mb-1">
                EXECUTION FLOW
              </span>
              <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
                How CamAudit Processes Media Streams
              </h3>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs font-mono-tech text-slate-600 dark:text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Pure Client-Side Execution</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pipelineSteps.map((step, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 relative flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-mono-tech font-bold text-slate-300 dark:text-slate-700">
                      {step.step}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      {step.icon}
                    </div>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                    {step.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Deep Suite Modules Directory */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-xs font-mono-tech uppercase mb-3 shadow-sm">
            <Layers className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>SUITE MODULE SPECIFICATIONS</span>
          </div>
          <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white tracking-tight mb-3">
            Hardware Diagnostic Subsystems
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Comprehensive architectural specifications, mathematical algorithms, and digital signal pipelines for each hardware subsystem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projectModules.map((mod, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl glass-panel border border-slate-200/80 dark:border-white/8 flex flex-col justify-between shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 flex items-center justify-center shadow-sm">
                    {mod.icon}
                  </div>
                  <span className="text-[10px] font-mono-tech px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-semibold uppercase">
                    {mod.category}
                  </span>
                </div>

                <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white mb-2">
                  {mod.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  {mod.description}
                </p>

                <div className="space-y-2 py-3 border-t border-slate-200/80 dark:border-white/5">
                  {mod.details.map((detail, dIdx) => (
                    <div key={dIdx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200/80 dark:border-white/5 mt-4 flex items-center justify-between text-[11px] font-mono-tech text-slate-500 dark:text-slate-400">
                <span>SUBSYSTEM STATUS</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">STANDARDS COMPLIANT</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
