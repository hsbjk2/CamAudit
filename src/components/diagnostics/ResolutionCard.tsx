import { Monitor } from 'lucide-react';
import { ResolutionMetrics } from '../../types';

interface ResolutionCardProps {
  resolution: ResolutionMetrics;
}

export function ResolutionCard({ resolution }: ResolutionCardProps) {
  const getBadgeColor = (cat: string) => {
    switch (cat) {
      case '4K':
      case 'Ultra HD':
        return 'bg-purple-100 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-500/30';
      case '2K':
      case 'Full HD':
        return 'bg-cyan-100 dark:bg-cyan-950/70 text-cyan-800 dark:text-cyan-300 border-cyan-300 dark:border-cyan-500/30';
      case 'HD':
        return 'bg-sky-100 dark:bg-sky-950/70 text-sky-800 dark:text-sky-300 border-sky-300 dark:border-sky-500/30';
      case 'Standard':
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600';
      default:
        return 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-500/30';
    }
  };

  const totalMegapixels = resolution.width && resolution.height 
    ? ((resolution.width * resolution.height) / 1000000).toFixed(1)
    : '0.0';

  return (
    <div className="p-4 rounded-xl glass-panel border border-slate-200/80 dark:border-white/8 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Monitor className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          <span className="text-xs font-mono-tech text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            RESOLUTION
          </span>
        </div>
        <span className={`text-[10px] font-mono-tech px-2 py-0.5 rounded border ${getBadgeColor(resolution.category)}`}>
          {resolution.category}
        </span>
      </div>

      <div className="my-2">
        <div className="text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
          {resolution.width > 0 ? `${resolution.width} × ${resolution.height}` : 'No Signal'}
        </div>
        <div className="flex items-center gap-2 mt-1 text-xs text-slate-600 dark:text-slate-400 font-mono-tech">
          <span>{totalMegapixels} Megapixels</span>
          <span>•</span>
          <span>{resolution.aspectRatio} Aspect</span>
        </div>
      </div>

      {/* Visual Resolution Scale Bar */}
      <div className="mt-3 pt-2 border-t border-slate-200/80 dark:border-white/5">
        <div className="flex items-center justify-between text-[10px] font-mono-tech text-slate-500 mb-1">
          <span>SD</span>
          <span>HD</span>
          <span>FHD</span>
          <span>4K</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-sky-400 via-cyan-400 to-purple-400 transition-all duration-500"
            style={{ 
              width: resolution.category === '4K' ? '100%' :
                     resolution.category === '2K' ? '80%' :
                     resolution.category === 'Full HD' ? '65%' :
                     resolution.category === 'HD' ? '45%' :
                     resolution.category === 'Standard' ? '30%' : '15%'
            }}
          />
        </div>
      </div>
    </div>
  );
}
