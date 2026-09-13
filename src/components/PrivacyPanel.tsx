import { Shield, Lock, ServerOff, UserCheck, EyeOff, FileText, CheckCircle2 } from 'lucide-react';

export function PrivacyPanel() {
  const privacyPillars = [
    {
      icon: <ServerOff className="w-5 h-5 text-cyan-400" />,
      title: 'No Uploads',
      description: 'Your webcam video feeds, audio recordings, and photos are never uploaded to any remote server.',
    },
    {
      icon: <Lock className="w-5 h-5 text-emerald-400" />,
      title: 'No Cloud Processing',
      description: 'All resolution estimation, FPS measuring, audio frequency FFT, and face detection happen on your CPU/GPU.',
    },
    {
      icon: <UserCheck className="w-5 h-5 text-sky-400" />,
      title: 'No Account Required',
      description: 'Zero telemetry sign-in, zero email collection, and zero tracking cookies. Open and test instantly.',
    },
    {
      icon: <EyeOff className="w-5 h-5 text-purple-400" />,
      title: 'Local Diagnostics Only',
      description: 'Test results are solely stored in your browser’s localStorage and can be wiped with a single click.',
    },
  ];

  return (
    <section className="py-12 border-t border-white/8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Banner Card */}
        <div className="relative rounded-3xl glass-panel border border-slate-200/90 dark:border-cyan-500/20 p-8 sm:p-12 overflow-hidden shadow-xl dark:shadow-2xl bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-[#090e1c] dark:to-[#04060b]">
          {/* Subtle decorative glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left: Headline & Description */}
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-mono-tech mb-4">
                <Shield className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>PRIVACY ARCHITECTURE VERIFIED</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
                Your Camera Stays Yours.
              </h2>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mb-6">
                CamAudit processes camera and microphone diagnostics directly inside your browser. Your video and audio are not uploaded to our servers.
              </p>

              <div className="flex flex-wrap gap-4 text-xs font-mono-tech text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  <span>HTML5 Sandboxed Streams</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Ephemerality By Default</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  <span>Zero Network Payloads</span>
                </div>
              </div>
            </div>

            {/* Right: Animated Privacy Shield Hologram */}
            <div className="lg:col-span-4 flex items-center justify-center">
              <div className="relative w-44 h-44 rounded-full border border-cyan-400/40 dark:border-cyan-500/30 flex items-center justify-center bg-cyan-50 dark:bg-cyan-950/20 backdrop-blur-xl glow-cyan-sm">
                <div className="w-32 h-32 rounded-full border border-cyan-400/40 flex items-center justify-center bg-white dark:bg-slate-900/80 shadow-inner">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-500/20 to-emerald-500/20 border border-cyan-400/60 flex items-center justify-center animate-pulse">
                    <Lock className="w-8 h-8 text-cyan-600 dark:text-cyan-300" />
                  </div>
                </div>
                <span className="absolute -bottom-2 px-2.5 py-0.5 rounded-full bg-slate-900 dark:bg-slate-950 border border-emerald-500/40 text-[10px] font-mono-tech text-emerald-400">
                  LOCAL ONLY
                </span>
              </div>
            </div>

          </div>

          {/* 4 Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10 pt-8 border-t border-slate-200 dark:border-white/8">
            {privacyPillars.map((pillar, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-white/80 dark:bg-slate-900/40 border border-slate-200/80 dark:border-white/5 shadow-sm">
                <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 flex items-center justify-center mb-3">
                  {pillar.icon}
                </div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">{pillar.title}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{pillar.description}</p>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
