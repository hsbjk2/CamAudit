import { CameraCapabilitiesInfo, ResolutionMetrics, FPSMetrics } from '../types';
import { Sliders, Check, X, Info } from 'lucide-react';

interface CameraCapabilitiesProps {
  capabilities: CameraCapabilitiesInfo;
  resolution: ResolutionMetrics;
  fps: FPSMetrics;
}

export function CameraCapabilities({ capabilities, resolution, fps }: CameraCapabilitiesProps) {
  const capabilityList = [
    { label: 'Optical / Digital Zoom', supported: capabilities.zoomSupported, note: 'Hardware / driver zoom control' },
    { label: 'Torch / Flash LED', supported: capabilities.torchSupported, note: 'Mobile device flash capability' },
    { label: 'Autofocus Control', supported: capabilities.focusSupported, note: 'Manual/continuous focus modes' },
    { label: 'White Balance Lock', supported: capabilities.whiteBalanceSupported, note: 'Color temperature adjustment' },
    { label: 'Exposure Compensation', supported: capabilities.exposureSupported, note: 'Manual EV exposure locking' },
  ];

  return (
    <div className="p-5 rounded-2xl glass-panel border border-slate-200/80 dark:border-white/8 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
          <h3 className="text-base font-display font-bold text-slate-900 dark:text-white">
            Camera Hardware Capabilities
          </h3>
        </div>
        <span className="text-[11px] font-mono-tech text-slate-500 dark:text-slate-400">
          MediaTrackCapabilities API
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5">
          <span className="text-[10px] font-mono-tech text-slate-500 uppercase block">Active Resolution</span>
          <span className="text-sm font-mono-tech font-bold text-slate-800 dark:text-slate-200">
            {resolution.width ? `${resolution.width}×${resolution.height}` : 'Standby'}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5">
          <span className="text-[10px] font-mono-tech text-slate-500 uppercase block">Framerate</span>
          <span className="text-sm font-mono-tech font-bold text-slate-800 dark:text-slate-200">
            {fps.current ? `${fps.current} FPS` : 'Standby'}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5">
          <span className="text-[10px] font-mono-tech text-slate-500 uppercase block">Facing Mode</span>
          <span className="text-sm font-mono-tech font-bold text-slate-800 dark:text-slate-200 capitalize">
            {capabilities.facingMode || 'User (Front)'}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5">
          <span className="text-[10px] font-mono-tech text-slate-500 uppercase block">Aspect Ratio</span>
          <span className="text-sm font-mono-tech font-bold text-slate-800 dark:text-slate-200">
            {resolution.aspectRatio}
          </span>
        </div>
      </div>

      {/* Advanced Capabilities Table */}
      <div className="divide-y divide-slate-200 dark:divide-white/5 border-t border-slate-200 dark:border-white/5">
        {capabilityList.map((item, idx) => (
          <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
            <div>
              <span className="font-medium text-slate-800 dark:text-slate-200 block">{item.label}</span>
              <span className="text-[11px] text-slate-500">{item.note}</span>
            </div>

            <div className="flex items-center gap-1.5">
              {item.supported ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 font-mono-tech text-[11px]">
                  <Check className="w-3.5 h-3.5" />
                  <span>Supported</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 font-mono-tech text-[11px]">
                  <X className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                  <span>Unsupported</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-white/5 flex items-center gap-2 text-[11px] text-slate-500 font-mono-tech">
        <Info className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
        <span>Hardware controls rely on operating system device drivers and browser flag availability.</span>
      </div>
    </div>
  );
}
