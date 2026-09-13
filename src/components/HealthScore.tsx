import { Award } from 'lucide-react';
import { QualityScore } from '../types';

interface HealthScoreProps {
  score: QualityScore;
  onGenerateReport: () => void;
}

export function HealthScore({ score, onGenerateReport }: HealthScoreProps) {
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score.overall / 100) * circumference;

  const getGradeColor = (grade: QualityScore['grade']) => {
    switch (grade) {
      case 'A+':
      case 'A':
        return 'text-emerald-800 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/40 bg-emerald-100 dark:bg-emerald-950/60';
      case 'B':
        return 'text-cyan-800 dark:text-cyan-400 border-cyan-300 dark:border-cyan-500/40 bg-cyan-100 dark:bg-cyan-950/60';
      case 'C':
        return 'text-amber-800 dark:text-amber-400 border-amber-300 dark:border-amber-500/40 bg-amber-100 dark:bg-amber-950/60';
      default:
        return 'text-rose-800 dark:text-rose-400 border-rose-300 dark:border-rose-500/40 bg-rose-100 dark:bg-rose-950/60';
    }
  };

  const breakdownItems = [
    { label: 'Resolution', value: score.breakdown.resolution, color: 'bg-cyan-500' },
    { label: 'Framerate (FPS)', value: score.breakdown.fps, color: 'bg-emerald-500' },
    { label: 'Lighting Quality', value: score.breakdown.lighting, color: 'bg-amber-500' },
    { label: 'Sharpness & Focus', value: score.breakdown.sharpness, color: 'bg-sky-500' },
    { label: 'Color Balance', value: score.breakdown.color, color: 'bg-purple-500' },
    { label: 'Frame Stability', value: score.breakdown.stability, color: 'bg-teal-500' },
  ];

  return (
    <div className="p-6 rounded-2xl glass-panel border border-slate-200/80 dark:border-white/8 shadow-sm">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        
        {/* Left: Animated Circular Score */}
        <div className="flex items-center gap-6">
          <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r={radius}
                className="text-slate-200 dark:text-slate-800"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="60"
                cy="60"
                r={radius}
                className="text-cyan-500 dark:text-cyan-400 transition-all duration-700 ease-out"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-display font-bold text-slate-900 dark:text-white tracking-tight leading-none">
                {score.overall}
              </span>
              <span className="text-[11px] font-mono-tech text-slate-500 dark:text-slate-400 mt-0.5">/ 100</span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white">Webcam Health</h3>
              <span className={`text-xs font-mono-tech font-bold px-2 py-0.5 rounded border ${getGradeColor(score.grade)}`}>
                Grade {score.grade}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xs leading-relaxed mb-3">
              Dynamic aggregate calculated in real-time from camera resolution, optical sharpness, lighting exposure, and frame stability.
            </p>
            <button
              id="generate-diagnostic-report-btn"
              onClick={onGenerateReport}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-300 hover:from-cyan-300 hover:to-sky-200 transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Generate Full Report</span>
            </button>
          </div>
        </div>

        {/* Right: Breakdown items */}
        <div className="w-full sm:max-w-md grid grid-cols-2 sm:grid-cols-3 gap-3">
          {breakdownItems.map((item, idx) => (
            <div key={idx} className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5">
              <div className="flex items-center justify-between text-[11px] font-mono-tech mb-1">
                <span className="text-slate-600 dark:text-slate-400 truncate">{item.label}</span>
                <span className="text-slate-900 dark:text-white font-bold">{item.value}</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div
                  className={`h-full ${item.color} transition-all duration-500 rounded-full`}
                  style={{ width: `${item.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
