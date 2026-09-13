import { Activity } from 'lucide-react';
import { FPSMetrics } from '../../types';

interface FPSMeterProps {
  fps: FPSMetrics;
}

export function FPSMeter({ fps }: FPSMeterProps) {
  const maxHistory = 60;

  return (
    <div className="p-4 rounded-xl glass-panel border border-slate-200/80 dark:border-white/8 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-xs font-mono-tech text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            FRAME RATE (FPS)
          </span>
        </div>
        <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/20">
          Target: {fps.target} FPS
        </span>
      </div>

      <div className="flex items-baseline gap-3 my-2">
        <span className="text-3xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
          {fps.current}
        </span>
        <span className="text-xs font-mono-tech text-slate-500 dark:text-slate-400">FPS</span>

        <div className="ml-auto text-right">
          <span className="text-xs font-mono-tech text-slate-500 dark:text-slate-400 block">Stability</span>
          <span className="text-sm font-mono-tech font-semibold text-emerald-600 dark:text-emerald-400">
            {fps.stability}%
          </span>
        </div>
      </div>

      {/* Real-time mini sparkline bar chart */}
      <div className="mt-3 pt-2 border-t border-slate-200/80 dark:border-white/5">
        <div className="flex items-end gap-1 h-8">
          {fps.history.map((val, idx) => {
            const heightPct = Math.min(100, Math.max(10, Math.round((val / maxHistory) * 100)));
            const isLatest = idx === fps.history.length - 1;
            return (
              <div
                key={idx}
                className="flex-1 bg-slate-200 dark:bg-slate-800/80 rounded-t-sm overflow-hidden flex items-end h-full"
                title={`${val} FPS`}
              >
                <div
                  className={`w-full transition-all duration-300 ${
                    isLatest 
                      ? 'bg-emerald-500 dark:bg-emerald-400 shadow-sm shadow-emerald-400/50' 
                      : val >= 28 ? 'bg-cyan-500/70' : 'bg-amber-500/70'
                  }`}
                  style={{ height: `${heightPct}%` }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
