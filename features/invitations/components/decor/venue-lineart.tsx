/**
 * A hand-drawn-style elevation of the venue — a domed pavilion flanked by
 * slender towers, rendered as gold line-art (the reference shows a similar
 * sketch of the ceremony venue). Deliberately generic so it flatters any
 * grand hall; swap for a real sketch per-venue later.
 */
export function VenueLineArt({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 300 170"
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="var(--inv-gold)"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* ground line */}
      <path d="M10 158 H 290" strokeOpacity="0.6" />

      {/* flanking towers */}
      <g strokeOpacity="0.8">
        <path d="M40 158 V 70 M70 158 V 70" />
        <path d="M40 70 Q 55 40 70 70" />
        <path d="M55 40 V 28" />
        <circle cx="55" cy="24" r="4" />
        <path d="M260 158 V 70 M230 158 V 70" />
        <path d="M230 70 Q 245 40 260 70" />
        <path d="M245 40 V 28" />
        <circle cx="245" cy="24" r="4" />
      </g>

      {/* main hall body */}
      <path d="M78 158 V 96 H 222 V 158" strokeOpacity="0.85" />

      {/* central dome + finial */}
      <path d="M96 96 Q 150 22 204 96" />
      <path d="M150 40 V 26" />
      <circle cx="150" cy="21" r="5" />

      {/* arched doorway */}
      <path d="M132 158 V 120 Q 150 100 168 120 V 158" strokeOpacity="0.8" />
      <path d="M150 158 V 108" strokeOpacity="0.5" />

      {/* windows */}
      <g strokeOpacity="0.65">
        <path d="M100 150 V 124 Q 108 114 116 124 V 150" />
        <path d="M184 150 V 124 Q 192 114 200 124 V 150" />
      </g>

      {/* steps */}
      <path d="M120 158 H 180 M112 166 H 188" strokeOpacity="0.5" />
    </svg>
  );
}
