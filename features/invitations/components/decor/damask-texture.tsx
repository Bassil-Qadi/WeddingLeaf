/**
 * Tone-on-tone floral damask used to give the envelope paper its embossed
 * texture (see the closed-envelope frames of assets/envelope.mp4). Rendered
 * as a tiling SVG <pattern> of a small five-petal bloom and leaf pair, drawn
 * a shade lighter than the paper so it reads as a pressed emboss rather than
 * printed ink. Purely decorative.
 */
export function DamaskTexture({
  className,
  opacity = 0.5,
}: {
  className?: string;
  opacity?: number;
}) {
  return (
    <svg
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern
          id="inv-damask"
          width="64"
          height="64"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(8)"
        >
          <g
            fill="none"
            stroke="var(--inv-paper-light)"
            strokeWidth="1.1"
            strokeLinecap="round"
            opacity={opacity}
          >
            {/* central bloom */}
            <circle cx="32" cy="20" r="2.4" fill="var(--inv-paper-light)" stroke="none" />
            {[0, 72, 144, 216, 288].map((a) => (
              <ellipse
                key={a}
                cx="32"
                cy="12.5"
                rx="3"
                ry="6"
                transform={`rotate(${a} 32 20)`}
              />
            ))}
            {/* trailing vine + leaves linking blooms diagonally */}
            <path d="M32 26 C 22 34, 14 44, 6 58" />
            <path d="M32 26 C 42 34, 50 44, 58 58" />
            <path d="M20 40 q -6 -3 -9 -9" />
            <path d="M44 40 q 6 -3 9 -9" />
            {/* corner buds so the tile reads continuous */}
            <circle cx="0" cy="0" r="1.6" fill="var(--inv-paper-light)" stroke="none" />
            <circle cx="64" cy="64" r="1.6" fill="var(--inv-paper-light)" stroke="none" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#inv-damask)" />
    </svg>
  );
}
