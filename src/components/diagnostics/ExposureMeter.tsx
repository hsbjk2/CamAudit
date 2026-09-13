import { Gauge, Contrast } from 'lucide-react';
import { ExposureMetrics } from '../../types';

interface ExposureMeterProps {
  exposure: ExposureMetrics;
  contrastScore: number;
}

export function ExposureMeter({ exposure, contrastScore }: ExposureMeterProps) {
  const getExposureBadge = (status: ExposureMetrics['status']) => {
    switch (status) {
      case 'Balanced':
        return 'bg-emerald-950/70 text-emerald-300 border-emerald-500/30';
      case 'Underexposed':
        return 'bg-sky-950/70 text-sky-300 border-sky-500/30';
      case 'Overexposed':
        return 'bg-amber-950/70 text-amber-300 border-amber-500/30';
    }
  };

  return (
    <div className="p-4 rounded-xl glass-panel border border-white/8 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Gauge className="w-4 h-4 text-sky-400" />
          <span className="text-xs font-mono-tech text-slate-400 uppercase tracking-wider">
            EXPOSURE & CONTRAST
          </span>
        </div>
        <span className={`text-[10px] font-mono-tech px-2 py-0.5 rounded border ${getExposureBadge(exposure.status)}`}>
          {exposure.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 my-2">
        <div>
          <span className="text-xs font-mono-tech text-slate-400 block">Exposure Score</span>
          <div className="text-2xl font-display font-bold text-white">
            {exposure.score}<span className="text-xs text-slate-400">/100</span>
          </div>
        </div>

        <div className="border-l border-white/10 pl-3">
          <div className="flex items-center gap-1.5 text-xs font-mono-tech text-slate-400">
            <Contrast className="w-3.5 h-3.5 text-cyan-400" />
            <span>Contrast</span>
          </div>
          <div className="text-2xl font-display font-bold text-cyan-300">
            {contrastScore}<span className="text-xs text-slate-400">/100</span>
          </div>
        </div>
      </div>

      {/* Tri-Zone Exposure Balance Gauge */}
      <div className="mt-3 pt-2 border-t border-white/5">
        <div className="flex items-center justify-between text-[10px] font-mono-tech text-slate-500 mb-1">
          <span>Under</span>
          <span className="text-emerald-400">Balanced</span>
          <span>Over</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-slate-800 relative flex overflow-hidden">
          <div className={`h-full transition-all duration-300 ${
            exposure.status === 'Underexposed' ? 'bg-sky-400 w-1/3' :
            exposure.status === 'Balanced' ? 'bg-emerald-400 w-full' :
            'bg-amber-400 w-full'
          }`} />
        </div>
      </div>
    </div>
  );
}
