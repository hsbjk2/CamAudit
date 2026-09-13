import { motion } from 'motion/react';
import { Camera, Mic, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { ThreeDWebcam } from './ThreeDWebcam';

interface HeroProps {
  onStartCamera?: () => void;
  onStartTesting?: () => void;
  onCheckMicrophone?: () => void;
  onQuickInspect?: () => void;
  onExploreDiagnostics?: () => void;
}

export function Hero({ 
  onStartCamera, 
  onStartTesting, 
  onCheckMicrophone, 
  onQuickInspect, 
  onExploreDiagnostics 
}: HeroProps) {
  const handleStart = onStartCamera || onStartTesting || (() => {});
  const handleMic = onCheckMicrophone || (() => {});
  const handleQuick = onQuickInspect || onExploreDiagnostics || handleStart;
  return (
    <section className="relative w-full overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24">
      {/* Ambient background glow & technical grid */}
      <div className="absolute inset-0 bg-tech-grid opacity-60 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headlines, CTAs, Privacy Trust Badges */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col items-start text-left"
          >
            {/* Small Badge with HSBJK */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 dark:bg-cyan-950/70 border border-cyan-500/30 text-cyan-700 dark:text-cyan-300 text-xs font-mono-tech uppercase tracking-wider mb-6 shadow-sm shadow-cyan-500/10">
              <span className="w-2 h-2 rounded-full bg-cyan-500 dark:bg-cyan-400 animate-ping" />
              <span>HSBJK • CAMAUDIT DIAGNOSTICS</span>
            </div>

            {/* Main Heading */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.12] mb-6">
              Your Webcam.{' '}
              <br className="hidden sm:inline" />
              Fully Tested.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-sky-500 to-teal-500 dark:from-cyan-400 dark:via-sky-300 dark:to-teal-300">
                In Seconds.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed mb-8">
              Check your camera, video quality, microphone, lighting, FPS and device capabilities directly from your browser.
            </p>

            {/* CTA Buttons */}
            <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-10">
              <button
                id="hero-start-camera-cta"
                onClick={handleStart}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-base font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-300 to-cyan-300 hover:from-cyan-300 hover:to-sky-200 transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <Camera className="w-5 h-5 text-slate-950" />
                <span>Start Camera Test</span>
              </button>

              <button
                id="hero-check-mic-cta"
                onClick={handleMic}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-base font-semibold text-slate-800 dark:text-white bg-white dark:bg-slate-900/80 hover:bg-slate-50 dark:hover:bg-slate-800/90 border border-slate-300 dark:border-slate-700/80 hover:border-cyan-500/40 transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer shadow-sm"
              >
                <Mic className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />
                <span>Check Microphone</span>
              </button>
            </div>

            {/* Privacy Trust Badge & Real-time guarantees */}
            <div className="w-full pt-6 border-t border-slate-200 dark:border-white/8 flex flex-wrap items-center gap-y-3 gap-x-6 text-xs text-slate-500 dark:text-slate-400 font-mono-tech">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
                <ShieldCheck className="w-4 h-4" />
                <span>100% browser-based • No video uploaded</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                <span>Zero Server Storage</span>
              </div>
              <div className="flex items-center gap-1.5 text-cyan-700 dark:text-cyan-300 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                <span>HSBJK Precision Architecture</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Interactive 3D Webcam Visualization */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col items-center justify-center relative"
          >
            <div className="w-full relative rounded-2xl glass-panel p-2 shadow-2xl shadow-cyan-500/5">
              <ThreeDWebcam />

              {/* Floating Quick Action Overlay */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm flex items-center justify-between p-3 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/10 shadow-xl">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-mono-tech text-slate-300">
                    DIAGNOSTIC ENGINE READY
                  </span>
                </div>
                <button
                  id="hero-quick-launch"
                  onClick={handleQuick}
                  className="text-xs font-medium text-cyan-300 hover:text-cyan-200 flex items-center gap-1 group py-1 px-2.5 rounded-md hover:bg-cyan-500/10 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Launch Suite</span>
                </button>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
