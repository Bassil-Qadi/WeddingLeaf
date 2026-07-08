/**
 * The stone archway that frames the hero reveal — a slender colonnade with a
 * rounded-gothic crown, drawn as line-art so it recolours with the palette
 * and needs no image asset. Sits behind the couple's names; foliage sprays
 * are layered over its columns by the hero (assets/envelope.mp4).
 */
export function ArchFrame({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 300 520"
      className={className}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      fill="none"
      stroke="var(--inv-script)"
      strokeOpacity="0.4"
      strokeWidth="2"
    >
      {/* outer arch */}
      <path d="M40 512 V 190 Q 40 40 150 40 Q 260 40 260 190 V 512" />
      {/* inner arch, a hair inside */}
      <path
        d="M54 512 V 192 Q 54 56 150 56 Q 246 56 246 192 V 512"
        strokeOpacity="0.22"
      />
      {/* keystone */}
      <path
        d="M136 44 h 28 l 6 18 h -40 z"
        fill="var(--inv-script)"
        fillOpacity="0.12"
      />
      {/* column bases + capitals */}
      <g strokeOpacity="0.3">
        <path d="M32 200 h 20 M248 200 h 20" />
        <path d="M30 505 h 28 M242 505 h 28" />
        <path d="M34 210 v 290 M266 210 v 290" strokeOpacity="0.18" />
      </g>
      {/* faint fluting on the columns */}
      <g strokeOpacity="0.12">
        <path d="M42 214 v 286 M46 214 v 286 M254 214 v 286 M258 214 v 286" />
      </g>
    </svg>
  );
}
