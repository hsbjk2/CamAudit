import { Focus } from 'lucide-react';
import { SharpnessMetrics } from '../../types';

interface SharpnessMeterProps {
  sharpness: SharpnessMetrics;
}

export function SharpnessMeter({ sharpness }: SharpnessMeterProps) {
  const isOptimal = sharpness.score >= 60;

  return (
    <div className="p-4 rounded-xl glass-panel border border-slate-200/80 dark:border-white/8 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Focus className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          <span className="text-xs font-mono-tech text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            SHARPNESS & FOCUS
          </span>
        </div>
        <span 
          className={`text-[10px] font-mono-tech px-2 py-0.5 rounded border ${
            sharpness.isBlurry 
              ? 'bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-500/30 animate-pulse' 
              : 'bg-cyan-100 dark:bg-cyan-950/70 text-cyan-800 dark:text-cyan-300 border-cyan-300 dark:border-cyan-500/30'
          }`}
        >
          {sharpness.isBlurry ? 'Blur Detected ⚠' : 'In Focus ✓'}
        </span>
      </div>

      <div className="my-2 flex items-baseline justify-between">
        <div>
          <div className="text-2xl font-display font-bold text-slate-900 dark:text-white">
            {sharpness.score}<span className="text-sm font-mono-tech text-slate-500 dark:text-slate-400 font-normal">/100</span>
          </div>
          <span className="text-xs font-mono-tech text-slate-600 dark:text-slate-400">
            Rating: <span className={isOptimal ? 'text-cyan-700 dark:text-cyan-300 font-semibold' : 'text-amber-700 dark:text-amber-400 font-semibold'}>{sharpness.status}</span>
          </span>
        </div>

        <div className="text-right">
          <span className="text-[11px] font-mono-tech text-slate-500 dark:text-slate-400 block">Edge Gradient</span>
          <span className="text-xs font-mono-tech text-cyan-700 dark:text-cyan-400 font-semibold">Laplacian Opt</span>
        </div>
      </div>

      {/* Progress meter */}
      <div className="mt-3 pt-2 border-t border-slate-200/80 dark:border-white/5">
        <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <div 
            className={`h-full transition-all duration-300 ${
              sharpness.isBlurry ? 'bg-rose-500' : 'bg-gradient-to-r from-cyan-500 to-sky-400'
            }`}
            style={{ width: `${sharpness.score}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[10px] font-mono-tech text-slate-500 mt-1">
          <span>Blurry</span>
          <span>Soft</span>
          <span>Sharp</span>
          <span>Crisp</span>
        </div>
      </div>
    </div>
  );
}
