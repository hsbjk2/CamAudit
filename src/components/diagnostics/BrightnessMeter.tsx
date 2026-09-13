import { Sun } from 'lucide-react';
import { BrightnessMetrics } from '../../types';

interface BrightnessMeterProps {
  brightness: BrightnessMetrics;
}

export function BrightnessMeter({ brightness }: BrightnessMeterProps) {
  const getStatusColor = (status: BrightnessMetrics['status']) => {
    switch (status) {
      case 'Good':
        return { 
          text: 'text-emerald-800 dark:text-emerald-400', 
          bg: 'bg-emerald-100 dark:bg-emerald-950/60', 
          border: 'border-emerald-300 dark:border-emerald-500/30' 
        };
      case 'Bright':
        return { 
          text: 'text-sky-800 dark:text-sky-300', 
          bg: 'bg-sky-100 dark:bg-sky-950/60', 
          border: 'border-sky-300 dark:border-sky-500/30' 
        };
      case 'Too Dark':
        return { 
          text: 'text-amber-800 dark:text-amber-400', 
          bg: 'bg-amber-100 dark:bg-amber-950/60', 
          border: 'border-amber-300 dark:border-amber-500/30' 
        };
      case 'Overexposed':
        return { 
          text: 'text-rose-800 dark:text-rose-400', 
          bg: 'bg-rose-100 dark:bg-rose-950/60', 
          border: 'border-rose-300 dark:border-rose-500/30' 
        };
    }
  };

  const style = getStatusColor(brightness.status);

  // SVG Circular Gauge calculations
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (brightness.percentage / 100) * circumference;

  return (
    <div className="p-4 rounded-xl glass-panel border border-slate-200/80 dark:border-white/8 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Sun className="w-4 h-4 text-amber-500 dark:text-amber-300" />
          <span className="text-xs font-mono-tech text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            BRIGHTNESS
          </span>
        </div>
        <span className={`text-[10px] font-mono-tech px-2 py-0.5 rounded border ${style.bg} ${style.text} ${style.border}`}>
          {brightness.status}
        </span>
      </div>

      <div className="flex items-center justify-between my-1">
        <div>
          <div className="text-2xl font-display font-bold text-slate-900 dark:text-white">
            {brightness.percentage}%
          </div>
          <span className="text-xs font-mono-tech text-slate-500 dark:text-slate-400">
            Luminance: {brightness.value}/255
          </span>
        </div>

        {/* Circular Gauge */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
            <circle
              cx="32"
              cy="32"
              r={radius}
              className="text-slate-200 dark:text-slate-800"
              strokeWidth="5"
              stroke="currentColor"
              fill="transparent"
            />
            <circle
              cx="32"
              cy="32"
              r={radius}
              className="text-amber-500 dark:text-amber-400 transition-all duration-300"
              strokeWidth="5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
            />
          </svg>
          <Sun className="absolute w-4 h-4 text-amber-500 dark:text-amber-300/80" />
        </div>
      </div>

      {/* Target Range Bar */}
      <div className="mt-3 pt-2 border-t border-slate-200/80 dark:border-white/5">
        <div className="flex items-center justify-between text-[10px] font-mono-tech text-slate-500 mb-1">
          <span>Dark</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Target Range</span>
          <span>Over</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 relative overflow-hidden">
          {/* Target zone indicator */}
          <div className="absolute left-[30%] right-[30%] top-0 bottom-0 bg-emerald-500/30" />
          <div 
            className="h-full bg-amber-500 dark:bg-amber-400 transition-all duration-300"
            style={{ width: `${brightness.percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
