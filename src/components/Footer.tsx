import { Shield } from 'lucide-react';
import { AppView } from '../types';
import { CamAuditLogo } from './CamAuditLogo';

interface FooterProps {
  onNavigate: (view: AppView) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="no-print border-t border-slate-200/80 dark:border-white/8 bg-slate-100/70 dark:bg-[#03060f] text-slate-500 dark:text-slate-400 text-xs py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-slate-200 dark:border-white/5">
          
          {/* Brand Info */}
          <div>
            <div 
              onClick={() => onNavigate('home')} 
              className="flex items-center gap-2 text-slate-900 dark:text-white font-display font-bold text-lg mb-2 cursor-pointer group"
            >
              <CamAuditLogo className="w-7 h-7" showGlow={false} />
              <span className="tracking-tight">Cam<span className="text-cyan-600 dark:text-cyan-400">Audit</span></span>
              <span className="text-[10px] font-mono-tech px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-500/20 font-semibold">
                by HSBJK
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              CamAudit is an official product of HSBJK. Next-generation privacy-first audio, camera, and device capabilities evaluation.
            </p>
          </div>

          {/* Nav Links */}
          <div className="flex flex-wrap gap-6 text-xs font-mono-tech">
            <button
              onClick={() => onNavigate('camera-test')}
              className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors cursor-pointer"
            >
              Camera Test
            </button>
            <button
              onClick={() => onNavigate('mic-test')}
              className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors cursor-pointer"
            >
              Microphone Test
            </button>
            <button
              onClick={() => onNavigate('speaker-test')}
              className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors cursor-pointer"
            >
              Speaker Test
            </button>
            <button
              onClick={() => onNavigate('diagnostics')}
              className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors cursor-pointer"
            >
              Diagnostics
            </button>
            <button
              onClick={() => onNavigate('history')}
              className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors cursor-pointer"
            >
              History
            </button>
            <button
              onClick={() => onNavigate('privacy')}
              className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors cursor-pointer"
            >
              Privacy
            </button>
          </div>

        </div>

        {/* Bottom copyright and privacy badge */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-mono-tech">
          <div>
            © 2026 CamAudit • A product of HSBJK. All diagnostics execute locally in browser.
          </div>

          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400/90 font-medium">
            <Shield className="w-3.5 h-3.5" />
            <span>Zero Remote Telemetry Guarantee</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
