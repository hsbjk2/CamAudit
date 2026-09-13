import React from 'react';
import { 
  BarChart3, 
  HelpCircle, 
  Monitor, 
  Activity, 
  Sun, 
  Focus, 
  Mic, 
  Volume2, 
  Check, 
  AlertTriangle, 
  XCircle,
  Sliders
} from 'lucide-react';

export const DiagnosticStandards: React.FC = () => {
  const standardsData = [
    {
      category: 'Optical Resolution',
      icon: <Monitor className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />,
      description: 'Total active sensor pixels acquired from the browser video track via video.videoWidth and videoHeight.',
      metric: 'Pixel Dimensions (W × H)',
      tiers: [
        { label: '4K Ultra HD (3840×2160)', status: 'Elite', badge: 'bg-purple-100 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300' },
        { label: '1080p Full HD (1920×1080)', status: 'Recommended', badge: 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300' },
        { label: '720p HD (1280×720)', status: 'Standard', badge: 'bg-cyan-100 dark:bg-cyan-950/70 text-cyan-800 dark:text-cyan-300' },
        { label: '480p SD (< 1280×720)', status: 'Sub-Optimal', badge: 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300' }
      ],
      impact: 'Higher resolution ensures crisp readability of text, whiteboard illustrations, and fine facial features during conferences.'
    },
    {
      category: 'Framerate Stability',
      icon: <Activity className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      description: 'Frequency of rendered optical frames computed using requestVideoFrameCallback or requestAnimationFrame high-resolution timestamps.',
      metric: 'Frames Per Second (FPS)',
      tiers: [
        { label: '60 FPS (Ultra Fluid)', status: 'Elite', badge: 'bg-purple-100 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300' },
        { label: '30 FPS (Web Standard)', status: 'Recommended', badge: 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300' },
        { label: '24–29 FPS (Acceptable)', status: 'Pass', badge: 'bg-cyan-100 dark:bg-cyan-950/70 text-cyan-800 dark:text-cyan-300' },
        { label: '< 20 FPS (Frame Jitter)', status: 'Drop Warning', badge: 'bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300' }
      ],
      impact: 'Prevents robotic motion blur, camera stutter, and audio-video desync over prolonged video meetings.'
    },
    {
      category: 'Photometric Luminance & Exposure',
      icon: <Sun className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
      description: 'Luma calculation based on the Rec. 601 standard: Y = 0.299R + 0.587G + 0.114B across a sampled frame grid.',
      metric: 'Luminance Value (0–255)',
      tiers: [
        { label: '40% – 70% Luminance', status: 'Optimal Lighting', badge: 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300' },
        { label: '71% – 85% Luminance', status: 'Bright Ambient', badge: 'bg-cyan-100 dark:bg-cyan-950/70 text-cyan-800 dark:text-cyan-300' },
        { label: '< 30% Luminance', status: 'Underexposed (Dark)', badge: 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300' },
        { label: '> 85% Luminance', status: 'Overexposed (Blown)', badge: 'bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300' }
      ],
      impact: 'Ensures natural skin tones and prevents harsh silhouettes caused by direct backlighting or gloomy ambient environments.'
    },
    {
      category: 'Laplacian Edge Sharpness',
      icon: <Focus className="w-5 h-5 text-sky-600 dark:text-sky-400" />,
      description: 'Discrete second-order spatial derivative filter measuring edge transitions and optical blur across image gradients.',
      metric: 'Sharpness Index (0–100)',
      tiers: [
        { label: 'Score 75 – 100', status: 'Razor Sharp', badge: 'bg-purple-100 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300' },
        { label: 'Score 55 – 74', status: 'Well-Focused', badge: 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300' },
        { label: 'Score 35 – 54', status: 'Soft Focus', badge: 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300' },
        { label: '< 35 Score', status: 'Blur / Out-of-Focus', badge: 'bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300' }
      ],
      impact: 'Identifies dirty lenses, lens smudge, fixed-focus distance mismatches, or auto-focus hunting.'
    },
    {
      category: 'Acoustic RMS & Decibel Range',
      icon: <Mic className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
      description: 'Root Mean Square (RMS) decibel relative to full scale (dBFS) processed continuously via Web Audio API.',
      metric: 'Decibels Relative to Full Scale (dBFS)',
      tiers: [
        { label: '-18 dB to -6 dB', status: 'Broadcast Speech', badge: 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300' },
        { label: '-30 dB to -19 dB', status: 'Quiet Voice', badge: 'bg-cyan-100 dark:bg-cyan-950/70 text-cyan-800 dark:text-cyan-300' },
        { label: '< -45 dB', status: 'Ambient Noise Floor', badge: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300' },
        { label: '> -1 dB', status: 'Clipping / Distortion', badge: 'bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300' }
      ],
      impact: 'Guarantees vocal intelligibility and catches microphone hardware gain overload before an important meeting.'
    },
    {
      category: 'Stereo Spatial Separation',
      icon: <Volume2 className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
      description: 'ChannelMergerNode and ChannelSplitterNode routing verification testing absolute 100% Left vs Right isolation.',
      metric: 'Stereo Channel Isolation (L vs R)',
      tiers: [
        { label: '0 dB Left / -∞ dB Right', status: 'True Left Isolation', badge: 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300' },
        { label: '0 dB Right / -∞ dB Left', status: 'True Right Isolation', badge: 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300' },
        { label: 'Bleed Detected (> -18 dB)', status: 'Crossover Warning', badge: 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300' },
        { label: 'No Output on 1 Channel', status: 'Mono / Dead Driver', badge: 'bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300' }
      ],
      impact: 'Identifies broken headphone cables, mono soundcard settings, and unbalanced desktop speakers.'
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-200 dark:border-white/8">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-xs font-mono-tech uppercase mb-3 shadow-sm">
          <BarChart3 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
          <span>TECHNICAL AUDITING BENCHMARKS</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white tracking-tight mb-4">
          Diagnostic Standards & Scoring Criteria
        </h2>
        <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          CamAudit applies verified telecommunication and digital signal processing standards to grade your audio-visual hardware. Here is how every parameter is mathematically calculated and interpreted.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {standardsData.map((std, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl glass-panel border border-slate-200/80 dark:border-white/8 flex flex-col justify-between shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 flex items-center justify-center shadow-sm">
                  {std.icon}
                </div>
                <span className="text-[10px] font-mono-tech text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {std.metric}
                </span>
              </div>

              <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white mb-2">
                {std.category}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                {std.description}
              </p>

              {/* Tiers list */}
              <div className="space-y-2 py-3 border-t border-slate-200/80 dark:border-white/5">
                {std.tiers.map((tier, tIdx) => (
                  <div key={tIdx} className="flex items-center justify-between text-xs">
                    <span className="text-slate-700 dark:text-slate-300 font-mono-tech truncate">
                      {tier.label}
                    </span>
                    <span className={`text-[10px] font-mono-tech px-2 py-0.5 rounded border border-transparent font-medium ${tier.badge}`}>
                      {tier.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200/80 dark:border-white/5 text-[11px] text-slate-500 dark:text-slate-400 italic">
              <strong>Impact:</strong> {std.impact}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
