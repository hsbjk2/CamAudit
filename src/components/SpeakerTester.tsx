import { Volume2, VolumeX, Music, CheckCircle2, Headphones, AlertCircle, Sparkles, Square } from 'lucide-react';
import { SpeakerChannel } from '../hooks/useSpeakerTest';

interface SpeakerTesterProps {
  activeChannel: SpeakerChannel;
  hasTested: boolean;
  onPlayTone: (channel: 'left' | 'right' | 'stereo') => void;
  onStopTone?: () => void;
  volume?: number;
  onVolumeChange?: (vol: number) => void;
}

export function SpeakerTester({
  activeChannel,
  hasTested,
  onPlayTone,
  onStopTone,
  volume = 0.7,
  onVolumeChange,
}: SpeakerTesterProps) {
  return (
    <div className="p-5 sm:p-6 rounded-2xl glass-panel border border-slate-200/80 dark:border-white/8 transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-950/50 border border-emerald-500/30 flex items-center justify-center text-emerald-500 dark:text-emerald-400 shrink-0">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white">
                Auditory Spatial & Channel Separation Test
              </h3>
              <span className="text-[10px] font-mono-tech px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold">
                HSBJK SPATIAL
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Discrete hardware channel routing for headphones, stereo monitors, and laptop speakers
            </p>
          </div>
        </div>

        {/* Volume & Stop Control */}
        <div className="flex flex-wrap items-center gap-3">
          {onVolumeChange && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10">
              <Volume2 className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                className="w-18 sm:w-24 h-1.5 accent-cyan-500 cursor-pointer"
                title={`Volume: ${Math.round(volume * 100)}%`}
                aria-label="Output Volume Slider"
              />
              <span className="text-[11px] font-mono-tech text-slate-600 dark:text-slate-400 w-7 text-right">
                {Math.round(volume * 100)}%
              </span>
            </div>
          )}

          {activeChannel && onStopTone && (
            <button
              onClick={onStopTone}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-xs font-semibold transition-colors cursor-pointer"
              title="Stop playback"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Stop</span>
            </button>
          )}

          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono-tech px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-emerald-600 dark:text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Stereo 48kHz
          </div>
        </div>
      </div>

      {/* Interactive Speaker Channel Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 mb-6">
        
        {/* 1. Left Channel Card */}
        <button
          id="speaker-test-left-btn"
          type="button"
          onClick={() => onPlayTone('left')}
          className={`p-4 sm:p-5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
            activeChannel === 'left'
              ? 'bg-cyan-500/15 dark:bg-cyan-950/70 border-cyan-500 dark:border-cyan-400 shadow-lg shadow-cyan-500/20 ring-2 ring-cyan-400/40 scale-[1.02]'
              : 'bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800/80 border-slate-200 dark:border-white/8 shadow-sm hover:shadow'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono-tech font-semibold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20">
                CHANNEL 0 // LEFT
              </span>
              <div
                className={`w-3.5 h-3.5 rounded-full ${
                  activeChannel === 'left' ? 'bg-cyan-400 animate-ping ring-2 ring-cyan-500' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              />
            </div>
            
            <div className="flex items-center gap-2 mb-1">
              <Volume2 className={`w-5 h-5 ${activeChannel === 'left' ? 'text-cyan-500 animate-bounce' : 'text-slate-400'}`} />
              <h4 className="text-base font-display font-bold text-slate-900 dark:text-white">
                Left Ear / Speaker
              </h4>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Pulsed 440 Hz chime routed strictly to physical Left channel
            </p>
          </div>

          <div className={`w-full py-2 rounded-lg text-center text-xs font-semibold transition-colors border ${
            activeChannel === 'left'
              ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-cyan-700 dark:text-cyan-300 border-slate-200 dark:border-white/5 hover:bg-cyan-50 dark:hover:bg-slate-700'
          }`}>
            {activeChannel === 'left' ? '🔊 Playing Left Only...' : 'Test Left Channel'}
          </div>
        </button>

        {/* 2. Stereo (Both) Channels Card */}
        <button
          id="speaker-test-stereo-btn"
          type="button"
          onClick={() => onPlayTone('stereo')}
          className={`p-4 sm:p-5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
            activeChannel === 'stereo'
              ? 'bg-purple-500/15 dark:bg-purple-950/70 border-purple-500 dark:border-purple-400 shadow-lg shadow-purple-500/20 ring-2 ring-purple-400/40 scale-[1.02]'
              : 'bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800/80 border-slate-200 dark:border-white/8 shadow-sm hover:shadow'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono-tech font-semibold px-2 py-0.5 rounded bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">
                CHANNELS 0 + 1 // STEREO
              </span>
              <div
                className={`w-3.5 h-3.5 rounded-full ${
                  activeChannel === 'stereo' ? 'bg-purple-400 animate-ping ring-2 ring-purple-500' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              />
            </div>

            <div className="flex items-center gap-2 mb-1">
              <Sparkles className={`w-5 h-5 ${activeChannel === 'stereo' ? 'text-purple-500 animate-spin' : 'text-slate-400'}`} />
              <h4 className="text-base font-display font-bold text-slate-900 dark:text-white">
                Both Speakers (Stereo)
              </h4>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Harmonic 554 Hz dual-channel auditory chord across both ears
            </p>
          </div>

          <div className={`w-full py-2 rounded-lg text-center text-xs font-semibold transition-colors border ${
            activeChannel === 'stereo'
              ? 'bg-purple-500 text-slate-950 border-purple-400 font-bold shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-purple-700 dark:text-purple-300 border-slate-200 dark:border-white/5 hover:bg-purple-50 dark:hover:bg-slate-700'
          }`}>
            {activeChannel === 'stereo' ? '🔊 Playing Both...' : 'Test Both Speakers'}
          </div>
        </button>

        {/* 3. Right Channel Card */}
        <button
          id="speaker-test-right-btn"
          type="button"
          onClick={() => onPlayTone('right')}
          className={`p-4 sm:p-5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
            activeChannel === 'right'
              ? 'bg-sky-500/15 dark:bg-sky-950/70 border-sky-500 dark:border-sky-400 shadow-lg shadow-sky-500/20 ring-2 ring-sky-400/40 scale-[1.02]'
              : 'bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800/80 border-slate-200 dark:border-white/8 shadow-sm hover:shadow'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono-tech font-semibold px-2 py-0.5 rounded bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/20">
                CHANNEL 1 // RIGHT
              </span>
              <div
                className={`w-3.5 h-3.5 rounded-full ${
                  activeChannel === 'right' ? 'bg-sky-400 animate-ping ring-2 ring-sky-500' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              />
            </div>

            <div className="flex items-center gap-2 mb-1">
              <Volume2 className={`w-5 h-5 ${activeChannel === 'right' ? 'text-sky-500 animate-bounce' : 'text-slate-400'}`} />
              <h4 className="text-base font-display font-bold text-slate-900 dark:text-white">
                Right Ear / Speaker
              </h4>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Pulsed 660 Hz chime routed strictly to physical Right channel
            </p>
          </div>

          <div className={`w-full py-2 rounded-lg text-center text-xs font-semibold transition-colors border ${
            activeChannel === 'right'
              ? 'bg-sky-400 text-slate-950 border-sky-300 font-bold shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-sky-700 dark:text-sky-300 border-slate-200 dark:border-white/5 hover:bg-sky-50 dark:hover:bg-slate-700'
          }`}>
            {activeChannel === 'right' ? '🔊 Playing Right Only...' : 'Test Right Channel'}
          </div>
        </button>
      </div>

      {/* Troubleshooting & System Tips */}
      <div className="space-y-2.5">
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
            <Music className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>
              For accurate spatial isolation, wear headphones or sit directly in front of stereo speakers.
            </span>
          </div>
          {hasTested && (
            <span className="text-xs font-mono-tech text-emerald-600 dark:text-emerald-400 flex items-center gap-1 shrink-0 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Spatial Test Verified</span>
            </span>
          )}
        </div>

        {/* Accessibility Mono Audio Guidance */}
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-300">
          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <span className="font-semibold">Hearing sound from both speakers when clicking Left or Right?</span> Check if your operating system has <strong>"Mono Audio"</strong> enabled in Accessibility settings (Windows: <em>Settings → Accessibility → Audio → Mono audio</em>, macOS: <em>System Settings → Accessibility → Audio → Play stereo audio as mono</em>, iOS/Android: <em>Accessibility → Hearing → Mono Audio</em>). When enabled, your operating system forces stereo signals to play equally on both sides.
          </p>
        </div>
      </div>
    </div>
  );
}
