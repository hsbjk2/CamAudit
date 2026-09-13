interface CamAuditLogoProps {
  className?: string;
  size?: number;
  showGlow?: boolean;
}

export function CamAuditLogo({ 
  className = 'w-9 h-9', 
  size,
  showGlow = true 
}: CamAuditLogoProps) {
  const dimensionStyle = size ? { width: `${size}px`, height: `${size}px` } : undefined;

  return (
    <div 
      className={`relative shrink-0 flex items-center justify-center select-none transition-transform duration-200 group-hover:scale-105 ${className}`}
      style={dimensionStyle}
    >
      {/* Soft Cyan/Blue Ambient Glow Behind Logo */}
      {showGlow && (
        <div 
          className="absolute inset-0 rounded-full bg-cyan-500/25 dark:bg-cyan-400/30 blur-md -z-10 group-hover:blur-lg group-hover:bg-cyan-400/40 transition-all duration-300"
          aria-hidden="true" 
        />
      )}
      <img
        src="/camaudit-logo.svg"
        alt="CamAudit Official Logo"
        className="w-full h-full object-contain drop-shadow-sm"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
