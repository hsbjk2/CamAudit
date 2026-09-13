import React, { useRef, useEffect } from 'react';
import { Mic, MicOff, AlertCircle, CheckCircle2, Volume2 } from 'lucide-react';
import { AudioMetrics, DeviceItem } from '../types';

interface MicrophoneTesterProps {
  microphones: DeviceItem[];
  selectedMicId: string;
  onSelectMic: (deviceId: string) => void;
  isActive: boolean;
  permissionStatus: 'prompt' | 'granted' | 'denied' | 'unsupported';
  error: { title: string; message: string } | null;
  metrics: AudioMetrics;
  analyser?: AnalyserNode | null;
  onStartMic: (deviceId?: string) => void;
  onStopMic: () => void;
}

export function MicrophoneTester({
  microphones,
  selectedMicId,
  onSelectMic,
  isActive,
  permissionStatus,
  error,
  metrics,
  analyser,
  onStartMic,
  onStopMic,
}: MicrophoneTesterProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Draw real-time animated waveform and frequency bars onto canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const sampleBuffer = new Uint8Array(128);
    const freqBuffer = new Uint8Array(64);

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Background subtle grid line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      if (isActive) {
        let timeArray: Uint8Array = metrics.timeData;
        let frequencyArray: Uint8Array = metrics.frequencyData;

        // If direct analyser is supplied, pull direct audio buffer for 60fps smoothness
        if (analyser) {
          try {
            analyser.getByteTimeDomainData(sampleBuffer);
            analyser.getByteFrequencyData(freqBuffer);
            timeArray = sampleBuffer;
            frequencyArray = freqBuffer;
          } catch {
            // fallback to props
          }
        }

        // 1. Draw Waveform (Oscilloscope style)
        if (timeArray && timeArray.length > 0) {
          ctx.lineWidth = 2;
          ctx.strokeStyle = '#06b6d4';
          ctx.beginPath();

          const sliceWidth = width / timeArray.length;
          let x = 0;

          for (let i = 0; i < timeArray.length; i++) {
            const v = timeArray[i] / 128.0;
            const y = (v * height) / 2;

            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
            x += sliceWidth;
          }
          ctx.stroke();
        }

        // 2. Draw Frequency Spectrum bars at bottom
        if (frequencyArray && frequencyArray.length > 0) {
          const barsCount = Math.min(32, frequencyArray.length);
          const barWidth = width / barsCount;

          for (let i = 0; i < barsCount; i++) {
            const rawVal = frequencyArray[i];
            const barHeight = (rawVal / 255) * (height * 0.42);
            ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
            ctx.fillRect(i * barWidth, height - barHeight, Math.max(1, barWidth - 1.5), barHeight);
          }
        }
      } else {
        // Idle flat line with gentle pulsing dot in center
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isActive, metrics.timeData, metrics.frequencyData, analyser]);

  return (
    <div className="p-6 rounded-2xl glass-panel border border-white/8 transition-all">
      {/* Header & Device Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-500 dark:text-sky-400 shrink-0">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white">
                Microphone Diagnostic
              </h3>
              <span className="text-[10px] font-mono-tech px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 font-semibold">
                HSBJK AUDIO
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Real-time Web Audio API signal processing & input monitoring
            </p>
          </div>
        </div>

        {/* Mic select & toggle */}
        <div className="flex items-center flex-wrap gap-2.5">
          {microphones.length > 0 && (
            <select
              id="microphone-select"
              value={selectedMicId}
              onChange={(e) => {
                const newId = e.target.value;
                onSelectMic(newId);
                if (isActive) onStartMic(newId);
              }}
              className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 max-w-[210px] truncate cursor-pointer"
            >
              {microphones.map((m) => (
                <option key={m.deviceId} value={m.deviceId}>
                  {m.label || `Microphone ${m.deviceId.slice(0, 6)}`}
                </option>
              ))}
            </select>
          )}

          {!isActive ? (
            <button
              id="mic-start-btn"
              onClick={() => onStartMic(selectedMicId)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-gradient-to-r from-sky-400 via-cyan-300 to-teal-300 hover:from-sky-300 hover:to-teal-200 transition-all shadow-md shadow-sky-500/20 cursor-pointer active:scale-95"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Test Microphone</span>
            </button>
          ) : (
            <button
              id="mic-stop-btn"
              onClick={onStopMic}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-300 bg-rose-500/10 dark:bg-rose-950/60 border border-rose-500/30 hover:bg-rose-500/20 transition-colors cursor-pointer active:scale-95"
            >
              <MicOff className="w-3.5 h-3.5" />
              <span>Stop Mic</span>
            </button>
          )}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="mb-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-xs font-mono-tech font-bold text-rose-700 dark:text-rose-300">{error.title}</h4>
            <p className="text-xs text-rose-600 dark:text-slate-300 mt-1">{error.message}</p>
            <button
              onClick={() => onStartMic(selectedMicId)}
              className="mt-2 text-xs text-rose-600 dark:text-rose-300 underline hover:opacity-80 font-medium cursor-pointer"
            >
              Retry Connection
            </button>
          </div>
        </div>
      )}

      {/* Waveform Visualizer Canvas (Oscilloscope keeps high-contrast dark monitor style) */}
      <div className="relative w-full h-32 rounded-xl bg-slate-950 keep-dark border border-slate-300 dark:border-white/10 overflow-hidden mb-6 flex items-center justify-center shadow-inner">
        <canvas
          ref={canvasRef}
          width={600}
          height={128}
          className="w-full h-full object-cover"
        />

        {/* Overlay Telemetry tags */}
        <div className="absolute top-2 left-3 text-[10px] font-mono-tech text-cyan-400/80">
          OSCILLOSCOPE // REALTIME_PCM
        </div>

        <div className="absolute top-2 right-3 text-[10px] font-mono-tech text-slate-300 flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? (metrics.isSilent ? 'bg-amber-400' : 'bg-emerald-400 animate-ping') : 'bg-slate-600'}`} />
          {isActive ? (metrics.isSilent ? 'SPEAK TO TEST' : 'SIGNAL DETECTED') : 'INPUT STANDBY'}
        </div>
      </div>

      {/* Real-time Meters: Current Volume, Peak, Average */}
      <div className="space-y-4">
        {/* Main Microphone Level Bar */}
        <div>
          <div className="flex items-center justify-between text-xs font-mono-tech mb-1.5">
            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
              INPUT SENSITIVITY LEVEL
            </span>
            <span className="text-cyan-600 dark:text-cyan-300 font-bold text-sm">{metrics.volume}%</span>
          </div>

          <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-white/10 p-0.5 overflow-hidden flex items-center">
            <div
              className={`h-full rounded-full transition-all duration-100 ${
                metrics.volume > 85 ? 'bg-rose-500 shadow-sm shadow-rose-500/50' :
                metrics.volume > 65 ? 'bg-amber-400 shadow-sm shadow-amber-400/50' :
                'bg-gradient-to-r from-cyan-400 to-sky-400 shadow-sm shadow-cyan-500/50'
              }`}
              style={{ width: `${Math.max(2, metrics.volume)}%` }}
            />
          </div>
        </div>

        {/* Peak & Average readouts */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 flex items-center justify-between">
            <span className="text-[11px] font-mono-tech text-slate-500 dark:text-slate-400">Peak Level</span>
            <span className="text-sm font-mono-tech font-bold text-slate-900 dark:text-white">{metrics.peak}%</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 flex items-center justify-between">
            <span className="text-[11px] font-mono-tech text-slate-500 dark:text-slate-400">Average Level</span>
            <span className="text-sm font-mono-tech font-bold text-slate-800 dark:text-slate-200">{metrics.average}%</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 flex items-center justify-between">
            <span className="text-[11px] font-mono-tech text-slate-500 dark:text-slate-400">Status</span>
            <span className={`text-xs font-mono-tech font-medium flex items-center gap-1.5 ${
              !isActive ? 'text-slate-400' :
              metrics.isSilent ? 'text-amber-500 dark:text-amber-400' : 'text-emerald-500 dark:text-emerald-400'
            }`}>
              {isActive && !metrics.isSilent && <CheckCircle2 className="w-3.5 h-3.5" />}
              {!isActive ? 'Offline' : metrics.isSilent ? 'Silent (Speak into mic)' : 'Good Signal'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
