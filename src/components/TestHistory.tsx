import { History, Trash2, ArrowUpRight, Award } from 'lucide-react';
import { DiagnosticReportData } from '../types';

interface TestHistoryProps {
  history: DiagnosticReportData[];
  onSelectReport: (report: DiagnosticReportData) => void;
  onClearHistory: () => void;
}

export function TestHistory({ history, onSelectReport, onClearHistory }: TestHistoryProps) {
  return (
    <div className="p-6 rounded-2xl glass-panel border border-slate-200/80 dark:border-white/8 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <History className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
          <h3 className="text-base font-display font-bold text-slate-900 dark:text-white">
            Previous Diagnostic Audits
          </h3>
        </div>

        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono-tech text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 border border-slate-200 dark:border-white/5 hover:border-rose-300 dark:hover:border-rose-500/20 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="py-8 text-center border border-dashed border-slate-300 dark:border-white/10 rounded-xl bg-slate-50/50 dark:bg-slate-900/30">
          <Award className="w-8 h-8 text-slate-400 dark:text-slate-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">No test audits recorded yet</p>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Run a camera or microphone diagnostic and click &ldquo;Generate Full Report&rdquo; to store metrics locally.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {history.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectReport(item)}
              className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900/60 hover:bg-slate-200/80 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-white/5 hover:border-cyan-400 dark:hover:border-cyan-500/30 flex items-center justify-between transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-100 dark:bg-cyan-950/60 border border-cyan-300 dark:border-cyan-500/20 flex flex-col items-center justify-center text-cyan-800 dark:text-cyan-300">
                  <span className="text-xs font-bold font-mono-tech leading-none">{item.overallScore}</span>
                  <span className="text-[9px] text-slate-500 dark:text-slate-400 font-mono-tech">/100</span>
                </div>

                <div>
                  <div className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition-colors flex items-center gap-2">
                    <span>{item.cameraName}</span>
                    <span className="text-[10px] font-mono-tech px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {item.resolution}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 font-mono-tech">
                    {item.dateStr} • {item.fps} FPS • Grade {item.grade}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-[11px] font-mono-tech px-2 py-0.5 rounded ${
                  item.overallStatus === 'PASS' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30' :
                  item.overallStatus === 'WARNING' ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-500/30' :
                  'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-400 border border-rose-300 dark:border-rose-500/30'
                }`}>
                  {item.overallStatus}
                </span>
                <ArrowUpRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
