import { Palette } from 'lucide-react';
import { ColorMetrics } from '../../types';

interface ColorAnalyzerProps {
  color: ColorMetrics;
}

export function ColorAnalyzer({ color }: ColorAnalyzerProps) {
  const getWarmthBadge = (warmth: ColorMetrics['warmth']) => {
    switch (warmth) {
      case 'Warm':
        return 'bg-amber-950/70 text-amber-300 border-amber-500/30';
      case 'Cool':
        return 'bg-sky-950/70 text-sky-300 border-sky-500/30';
      default:
        return 'bg-emerald-950/70 text-emerald-300 border-emerald-500/30';
    }
  };

  return (
    <div className="p-4 rounded-xl glass-panel border border-white/8 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-mono-tech text-slate-400 uppercase tracking-wider">
            COLOR & RGB SPECTRUM
          </span>
        </div>
        <span className={`text-[10px] font-mono-tech px-2 py-0.5 rounded border ${getWarmthBadge(color.warmth)}`}>
          {color.warmth} Tone
        </span>
      </div>

      {/* RGB Distribution Bars */}
      <div className="my-2 space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="w-4 text-[10px] font-mono-tech text-rose-400 font-bold">R</span>
          <div className="flex-1 h-2 rounded bg-slate-800 overflow-hidden">
            <div 
              className="h-full bg-rose-500 transition-all duration-300 rounded"
              style={{ width: `${color.red}%` }}
            />
          </div>
          <span className="w-8 text-right text-[11px] font-mono-tech text-slate-300">{color.red}%</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-4 text-[10px] font-mono-tech text-emerald-400 font-bold">G</span>
          <div className="flex-1 h-2 rounded bg-slate-800 overflow-hidden">
            <div 
              className="h-full bg-emerald-500 transition-all duration-300 rounded"
              style={{ width: `${color.green}%` }}
            />
          </div>
          <span className="w-8 text-right text-[11px] font-mono-tech text-slate-300">{color.green}%</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-4 text-[10px] font-mono-tech text-sky-400 font-bold">B</span>
          <div className="flex-1 h-2 rounded bg-slate-800 overflow-hidden">
            <div 
              className="h-full bg-sky-500 transition-all duration-300 rounded"
              style={{ width: `${color.blue}%` }}
            />
          </div>
          <span className="w-8 text-right text-[11px] font-mono-tech text-slate-300">{color.blue}%</span>
        </div>
      </div>

      {/* 16-bin RGB Combined Histogram */}
      <div className="mt-3 pt-2 border-t border-white/5">
        <div className="flex items-center justify-between text-[10px] font-mono-tech text-slate-500 mb-1">
          <span>RGB Histogram (16-Bins)</span>
          <span className="text-cyan-300">Balance: {color.balance}%</span>
        </div>
        <div className="flex items-end gap-[2px] h-8 w-full bg-slate-900/60 p-1 rounded border border-white/5">
          {color.histogram.r.map((val, i) => {
            const h = Math.min(100, Math.max(10, val * 3));
            return (
              <div key={i} className="flex-1 flex flex-col justify-end h-full">
                <div 
                  className="w-full bg-gradient-to-t from-slate-700 via-cyan-500 to-sky-300 rounded-t-sm"
                  style={{ height: `${h}%` }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
