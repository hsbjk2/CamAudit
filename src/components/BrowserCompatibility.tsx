import { CheckCircle2, XCircle, Globe, Shield } from 'lucide-react';
import { BrowserSupport } from '../types';

interface BrowserCompatibilityProps {
  support: BrowserSupport;
}

export function BrowserCompatibility({ support }: BrowserCompatibilityProps) {
  const checks = [
    { name: 'Camera API (getUserMedia)', supported: support.cameraAPI, note: 'WebRTC video streaming' },
    { name: 'Microphone API', supported: support.microphoneAPI, note: 'WebRTC audio capture' },
    { name: 'MediaRecorder API', supported: support.mediaRecorder, note: 'Local video/audio container encoding' },
    { name: 'Web Audio API', supported: support.webAudio, note: 'Real-time FFT audio spectrum & tone generator' },
    { name: 'Canvas 2D Context', supported: support.canvas2D, note: 'Frame pixel brightness & sharpness analysis' },
    { name: 'Secure Context (HTTPS)', supported: support.secureContext, note: 'Hardware sandbox security' },
    { name: 'Device Enumeration', supported: support.deviceEnumeration, note: 'Hardware device listing' },
  ];

  return (
    <div className="p-6 rounded-2xl glass-panel border border-slate-200/80 dark:border-white/8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shadow-sm">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-display font-bold text-slate-900 dark:text-white">
              Browser Runtime Compatibility
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              HTML5 Media APIs verified on this device
            </p>
          </div>
        </div>

        <div>
          {support.isCompatible ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300 font-mono-tech text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Your Browser: Compatible ✓</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-500/40 text-amber-800 dark:text-amber-300 font-mono-tech text-xs font-semibold">
              <Shield className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Partial Compatibility</span>
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {checks.map((check, idx) => (
          <div
            key={idx}
            className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 flex items-start justify-between gap-3"
          >
            <div>
              <span className="text-xs font-medium text-slate-800 dark:text-slate-200 block">{check.name}</span>
              <span className="text-[10px] text-slate-500 font-mono-tech">{check.note}</span>
            </div>

            {check.supported ? (
              <span className="text-emerald-600 dark:text-emerald-400 shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </span>
            ) : (
              <span className="text-rose-600 dark:text-rose-400 shrink-0">
                <XCircle className="w-4 h-4" />
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
