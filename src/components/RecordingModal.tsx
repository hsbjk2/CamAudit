import { Download, X, Film } from 'lucide-react';

interface RecordingModalProps {
  videoUrl: string | null;
  duration: number;
  onClose: () => void;
}

export function RecordingModal({ videoUrl, duration, onClose }: RecordingModalProps) {
  if (!videoUrl) return null;

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = videoUrl;
    a.download = `camaudit-recording-${Date.now()}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl rounded-2xl glass-panel border border-cyan-500/30 p-6 shadow-2xl bg-[#090d18] text-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <Film className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-display font-bold text-white">
              Recorded Video Preview
            </h3>
            <span className="text-xs font-mono-tech px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              {formatTimer(duration)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-4 rounded-xl overflow-hidden bg-black border border-white/10 aspect-video flex items-center justify-center">
          <video
            src={videoUrl}
            controls
            autoPlay
            className="w-full h-full object-contain"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs font-mono-tech text-emerald-400">
            ✓ 100% Local • Never sent to any external server
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-300 hover:from-cyan-300 hover:to-sky-200 transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Video</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
