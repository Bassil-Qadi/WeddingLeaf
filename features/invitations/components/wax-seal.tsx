export function WaxSeal({ className }: { className?: string }) {
    return (
      <svg
        viewBox="0 0 80 80"
        className={className}
        role="img"
        aria-label="ختم الدعوة"
      >
        <defs>
          <radialGradient id="waxGradient" cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#e3c481" />
            <stop offset="55%" stopColor="#c6a86a" />
            <stop offset="100%" stopColor="#9c7f45" />
          </radialGradient>
        </defs>
        <circle cx="40" cy="40" r="36" fill="url(#waxGradient)" />
        <circle
          cx="40"
          cy="40"
          r="36"
          fill="none"
          stroke="#7a6236"
          strokeWidth="1"
          opacity="0.4"
        />
        {/* simple monogram mark — two interlocking initials placeholder */}
        <path
          d="M28 50 L40 28 L52 50 M33 42 H47"
          fill="none"
          stroke="#3d2f14"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.75"
        />
      </svg>
    );
  }