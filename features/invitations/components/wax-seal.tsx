export function WaxSeal({ className }: { className?: string }) {
    return (
      <svg
        viewBox="0 0 80 80"
        className={className}
        role="img"
        aria-label="ختم الدعوة الشمعي"
      >
        <defs>
          <radialGradient id="waxGradient" cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#9c3b47" />
            <stop offset="55%" stopColor="#6b1f2b" />
            <stop offset="100%" stopColor="#43131c" />
          </radialGradient>
        </defs>
        <circle cx="40" cy="40" r="36" fill="url(#waxGradient)" />
        <circle
          cx="40"
          cy="40"
          r="36"
          fill="none"
          stroke="var(--primary)"
          strokeOpacity="0.5"
          strokeWidth="1"
        />
      </svg>
    );
  }