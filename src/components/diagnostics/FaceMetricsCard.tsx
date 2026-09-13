import { UserCheck, UserX, Scan, Crosshair } from 'lucide-react';
import { FaceMetrics } from '../../types';

interface FaceMetricsCardProps {
  face: FaceMetrics;
}

export function FaceMetricsCard({ face }: FaceMetricsCardProps) {
  return (
    <div className="p-4 rounded-xl glass-panel border border-slate-200/80 dark:border-white/8 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Scan className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          <span className="text-xs font-mono-tech text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            FACE FRAMING & POSITION
          </span>
        </div>
        <span 
          className={`text-[10px] font-mono-tech px-2 py-0.5 rounded border ${
            face.detected 
              ? 'bg-cyan-100 dark:bg-cyan-950/70 text-cyan-800 dark:text-cyan-300 border-cyan-300 dark:border-cyan-500/30' 
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'
          }`}
        >
          {face.detected ? 'Tracked ✓' : 'Searching...'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 my-2">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono-tech mb-0.5">
            {face.detected ? (
              <UserCheck className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            ) : (
              <UserX className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
            )}
            <span>Alignment</span>
          </div>
          <div className="text-2xl font-display font-bold text-slate-900 dark:text-white">
            {face.detected ? `${face.centerAlignment}%` : '--'}
          </div>
        </div>

        <div className="border-l border-slate-200/80 dark:border-white/10 pl-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono-tech mb-0.5">
            <Crosshair className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>Distance</span>
          </div>
          <div className="text-sm font-mono-tech font-semibold text-cyan-700 dark:text-cyan-300 mt-1">
            {face.distanceEstimate}
          </div>
        </div>
      </div>

      {/* Center alignment & size indicator */}
      <div className="mt-3 pt-2 border-t border-slate-200/80 dark:border-white/5">
        <div className="flex justify-between items-center text-[10px] font-mono-tech text-slate-500 mb-1">
          <span>Frame Coverage</span>
          <span className="text-slate-700 dark:text-slate-300 font-semibold">{face.detected ? `${face.sizePercentage}% of viewport` : '0%'}</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <div 
            className="h-full bg-cyan-500 dark:bg-cyan-400 transition-all duration-300"
            style={{ width: `${face.detected ? face.sizePercentage * 2 : 0}%` }}
          />
        </div>
      </div>
    </div>
  );
}
