import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Does CamAudit upload my camera video or audio?',
      a: 'No. CamAudit is engineered strictly as an in-browser client application. Your camera stream, microphone audio, snapshots, and recorded video are processed purely in local memory (via HTML5 Canvas and Web Audio API) and are never transmitted over a network or saved to external servers.',
    },
    {
      q: 'Do I need an account or subscription to use CamAudit?',
      a: 'No account, email, or login is required. You can test your camera, microphones, and speakers immediately upon visiting the website.',
    },
    {
      q: 'Does CamAudit work on mobile devices?',
      a: 'Yes. CamAudit is fully responsive and supports mobile browsers on iOS (Safari) and Android (Chrome, Firefox) with front and back camera detection, portrait orientation adjustments, and touch controls.',
    },
    {
      q: "Why isn't my camera detected by my browser?",
      a: 'This typically occurs if another application (such as Zoom, Microsoft Teams, FaceTime, or another browser tab) is currently using the camera exclusively, or if camera permissions were previously denied in your browser settings. Close any conflicting apps, ensure permissions are set to "Allow", and click "Retry Camera".',
    },
    {
      q: 'Does it require a backend or server?',
      a: 'No backend server is required. All device enumeration, FPS tracking, luminance and sharpness calculations, face tracking, tone generation, and report generation execute client-side.',
    },
  ];

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-16 border-t border-slate-200 dark:border-white/8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-xs font-mono-tech mb-3 shadow-sm">
            <HelpCircle className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>KNOWLEDGE BASE</span>
          </div>
          <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white tracking-tight mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Answers regarding privacy, browser compatibility, and webcam hardware
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl glass-panel border border-slate-200/80 dark:border-white/8 overflow-hidden transition-colors shadow-sm"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-cyan-600 dark:text-cyan-400' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200 dark:border-white/5 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
