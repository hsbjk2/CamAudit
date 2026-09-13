import { Shield, Check, X, AlertTriangle, Lock, Globe, Camera, Mic } from 'lucide-react';
import { BrowserSupport } from '../types';

interface PermissionsPanelProps {
  cameraPermission: 'prompt' | 'granted' | 'denied' | 'unsupported';
  micPermission: 'prompt' | 'granted' | 'denied' | 'unsupported';
  browserSupport: BrowserSupport;
  onRequestCamera: () => void;
  onRequestMic: () => void;
}

export function PermissionsPanel({
  cameraPermission,
  micPermission,
  browserSupport,
  onRequestCamera,
  onRequestMic,
}: PermissionsPanelProps) {
  const isAnyBlocked = cameraPermission === 'denied' || micPermission === 'denied';

  return (
    <div className="p-5 rounded-2xl glass-panel border border-slate-200/80 dark:border-white/8 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <Shield className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
          <h3 className="text-base font-display font-bold text-slate-900 dark:text-white">
            System & Browser Permissions
          </h3>
        </div>
        <span className="text-[11px] font-mono-tech text-slate-500 dark:text-slate-400">
          SECURITY PROTOCOL
        </span>
      </div>

      {/* Permissions Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Camera Permission */}
        <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900/70 border border-slate-200 dark:border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono-tech text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              Camera
            </span>
            {cameraPermission === 'granted' ? (
              <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                <Check className="w-3 h-3" />
              </span>
            ) : cameraPermission === 'denied' ? (
              <span className="w-4 h-4 rounded-full bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 flex items-center justify-center">
                <X className="w-3 h-3" />
              </span>
            ) : (
              <span className="w-2 h-2 rounded-full bg-amber-500 dark:bg-amber-400" />
            )}
          </div>
          <div>
            <span className="text-sm font-semibold text-slate-900 dark:text-white block">
              {cameraPermission === 'granted' ? 'Allowed ✓' :
               cameraPermission === 'denied' ? 'Blocked ✗' : 'Prompt / Required'}
            </span>
            {cameraPermission !== 'granted' && (
              <button
                onClick={onRequestCamera}
                className="mt-1 text-[11px] text-cyan-700 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-300 font-medium underline cursor-pointer"
              >
                Request Access
              </button>
            )}
          </div>
        </div>

        {/* Microphone Permission */}
        <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900/70 border border-slate-200 dark:border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono-tech text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <Mic className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              Microphone
            </span>
            {micPermission === 'granted' ? (
              <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                <Check className="w-3 h-3" />
              </span>
            ) : micPermission === 'denied' ? (
              <span className="w-4 h-4 rounded-full bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 flex items-center justify-center">
                <X className="w-3 h-3" />
              </span>
            ) : (
              <span className="w-2 h-2 rounded-full bg-amber-500 dark:bg-amber-400" />
            )}
          </div>
          <div>
            <span className="text-sm font-semibold text-slate-900 dark:text-white block">
              {micPermission === 'granted' ? 'Allowed ✓' :
               micPermission === 'denied' ? 'Blocked ✗' : 'Prompt / Required'}
            </span>
            {micPermission !== 'granted' && (
              <button
                onClick={onRequestMic}
                className="mt-1 text-[11px] text-sky-700 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300 font-medium underline cursor-pointer"
              >
                Request Access
              </button>
            )}
          </div>
        </div>

        {/* Browser Media APIs */}
        <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900/70 border border-slate-200 dark:border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono-tech text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Browser
            </span>
            <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <Check className="w-3 h-3" />
            </span>
          </div>
          <div>
            <span className="text-sm font-semibold text-slate-900 dark:text-white block">
              {browserSupport.cameraAPI ? 'Supported ✓' : 'Limited'}
            </span>
            <span className="text-[11px] text-slate-500 font-mono-tech">
              HTML5 MediaStream
            </span>
          </div>
        </div>

        {/* Secure Context (HTTPS) */}
        <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900/70 border border-slate-200 dark:border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono-tech text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              Security
            </span>
            {browserSupport.secureContext ? (
              <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                <Check className="w-3 h-3" />
              </span>
            ) : (
              <span className="w-4 h-4 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 flex items-center justify-center">
                <AlertTriangle className="w-3 h-3" />
              </span>
            )}
          </div>
          <div>
            <span className="text-sm font-semibold text-slate-900 dark:text-white block">
              {browserSupport.secureContext ? 'HTTPS / Secure ✓' : 'Insecure Context'}
            </span>
            <span className="text-[11px] text-slate-500 font-mono-tech">
              Hardware Sandboxing
            </span>
          </div>
        </div>
      </div>

      {/* Clear Helpful Instructions If Permission Is Blocked */}
      {isAnyBlocked && (
        <div className="mt-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-500/30 text-xs">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold mb-1">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>How to unblock permissions in your browser:</span>
          </div>
          <ol className="list-decimal list-inside space-y-1 text-slate-700 dark:text-slate-300 ml-1 mt-2">
            <li>Click the <strong>Lock</strong> or <strong>Camera / Microphone icon</strong> in your browser's address bar.</li>
            <li>Toggle <strong>Camera</strong> and <strong>Microphone</strong> from "Block" to <strong>"Allow"</strong>.</li>
            <li>Click <strong>Retry Camera</strong> or reload the page to apply the change.</li>
          </ol>
        </div>
      )}
    </div>
  );
}
