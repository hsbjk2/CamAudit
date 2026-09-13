import { Lightbulb, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { LightingAdvice } from '../../types';

interface LightingAssistantProps {
  advice: LightingAdvice;
}

export function LightingAssistant({ advice }: LightingAssistantProps) {
  const getCardStyle = () => {
    switch (advice.severity) {
      case 'success':
        return {
          border: 'border-emerald-300 dark:border-emerald-500/30',
          bg: 'bg-emerald-50 dark:bg-emerald-950/20',
          text: 'text-emerald-700 dark:text-emerald-400',
          icon: <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
        };
      case 'error':
        return {
          border: 'border-rose-300 dark:border-rose-500/40',
          bg: 'bg-rose-50 dark:bg-rose-950/20',
          text: 'text-rose-700 dark:text-rose-400',
          icon: <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400" />,
        };
      default:
        return {
          border: 'border-amber-300 dark:border-amber-500/30',
          bg: 'bg-amber-50 dark:bg-amber-950/20',
          text: 'text-amber-700 dark:text-amber-400',
          icon: <Info className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
        };
    }
  };

  const style = getCardStyle();

  return (
    <div className={`p-4 rounded-xl border ${style.border} ${style.bg} backdrop-blur-md transition-all duration-300`}>
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 shrink-0 shadow-sm">
          <Lightbulb className={`w-5 h-5 ${style.text}`} />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`font-mono-tech text-xs font-bold tracking-wide uppercase ${style.text}`}>
              {advice.headline}
            </span>
            <span className="text-[10px] font-mono-tech px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/5">
              AI ASSISTANT
            </span>
          </div>

          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            {advice.message}
          </p>
        </div>
      </div>
    </div>
  );
}
