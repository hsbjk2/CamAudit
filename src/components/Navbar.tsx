import { useState, type ReactNode } from 'react';
import { Camera, Mic, Activity, ShieldCheck, Menu, X, ChevronRight, Volume2, Sun, Moon, Sparkles } from 'lucide-react';
import { AppView } from '../types';
import { CamAuditLogo } from './CamAuditLogo';

interface NavbarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  onStartTesting?: () => void;
  isCameraActive?: boolean;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
}

export function Navbar({ 
  currentView, 
  onNavigate, 
  onStartTesting, 
  isCameraActive,
  isDarkMode = true,
  onToggleTheme,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { label: string; view: AppView; icon: ReactNode }[] = [
    { label: 'Home', view: 'home', icon: null },
    { label: 'Camera Test', view: 'camera-test', icon: <Camera className="w-4 h-4 text-cyan-400" /> },
    { label: 'Mic Test', view: 'mic-test', icon: <Mic className="w-4 h-4 text-sky-400" /> },
    { label: 'Speaker Test', view: 'speaker-test', icon: <Volume2 className="w-4 h-4 text-emerald-400" /> },
    { label: 'Diagnostics', view: 'diagnostics', icon: <Activity className="w-4 h-4 text-cyan-400" /> },
    { label: 'Privacy', view: 'privacy', icon: <ShieldCheck className="w-4 h-4 text-emerald-400" /> },
  ];

  const handleItemClick = (view: AppView) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-white/8 bg-white/90 dark:bg-[#07090e]/85 backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo with HSBJK branding */}
        <button
          id="camaudit-logo-btn"
          onClick={() => handleItemClick('home')}
          className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-lg p-1"
          aria-label="CamAudit Home"
        >
          <CamAuditLogo className="w-10 h-10" />
          <div className="flex flex-col text-left">
            <span className="font-display font-bold text-lg tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              CamAudit
              <span className="text-[10px] font-mono-tech px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 font-semibold">
                by HSBJK
              </span>
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 -mt-0.5 tracking-wider uppercase font-mono-tech">
              HSBJK Hardware Suite
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = currentView === item.view;
            return (
              <button
                key={item.view}
                id={`nav-link-${item.view}`}
                onClick={() => handleItemClick(item.view)}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  isActive
                    ? 'text-cyan-700 dark:text-cyan-300 bg-cyan-500/15 dark:bg-cyan-500/10 border border-cyan-500/30 dark:border-cyan-500/20 shadow-sm shadow-cyan-500/10'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right CTA & Light/Dark Theme Switcher */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Light / Dark Mode Toggle */}
          {onToggleTheme && (
            <button
              id="theme-toggle-btn"
              onClick={onToggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-slate-200 dark:border-white/10 transition-colors cursor-pointer"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-300" />
              ) : (
                <Moon className="w-4 h-4 text-cyan-600" />
              )}
            </button>
          )}

          <button
            id="navbar-start-testing-btn"
            onClick={() => {
              if (onStartTesting) onStartTesting();
              else onNavigate('camera-test');
            }}
            className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-300 hover:from-cyan-300 hover:to-sky-200 transition-all shadow-md shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <span>{isCameraActive ? 'Camera Active' : 'Start Testing'}</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* Mobile Hamburger & Theme Toggle */}
        <div className="flex md:hidden items-center gap-2">
          {onToggleTheme && (
            <button
              id="mobile-theme-toggle"
              onClick={onToggleTheme}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-slate-200 dark:border-white/10"
              aria-label="Toggle Dark / Light Theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-cyan-600" />}
            </button>
          )}
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-white/10 bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl px-4 pt-3 pb-5 space-y-2 shadow-xl">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => handleItemClick(item.view)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                currentView === item.view
                  ? 'text-cyan-700 dark:text-cyan-300 bg-cyan-500/15 dark:bg-cyan-500/10 border border-cyan-500/30 dark:border-cyan-500/20'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900/60'
              }`}
            >
              <span className="flex items-center gap-2.5">
                {item.icon}
                {item.label}
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          ))}
          <div className="pt-3">
            <button
              onClick={() => {
                if (onStartTesting) onStartTesting();
                else onNavigate('camera-test');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-300 shadow-md shadow-cyan-500/20"
            >
              <span>Start Camera Test</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
