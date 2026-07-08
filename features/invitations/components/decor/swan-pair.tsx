/** One swan facing inward (to the right), drawn white with a soft grey edge. */
function Swan() {
  return (
    <g>
      {/* body — plump breast at the front, a lifted pointed tail at the back */}
      <path
        d="M20 112 C 12 118 20 126 32 124 C 26 120 30 116 36 116 C 62 108 80 110 86 120 C 91 127 84 134 72 134 C 52 137 30 134 24 126 C 21 122 19 116 20 112 Z"
        fill="#fffdfb"
        stroke="var(--inv-ink-soft)"
        strokeOpacity="0.35"
        strokeWidth="1"
      />
      {/* folded wing */}
      <path
        d="M40 116 C 56 108 74 110 83 121"
        fill="none"
        stroke="var(--inv-ink-soft)"
        strokeOpacity="0.3"
        strokeWidth="1"
      />
      {/* neck — grey backing then white fill for a clean edge */}
      <path
        d="M82 112 C 92 90 96 66 105 49"
        fill="none"
        stroke="var(--inv-ink-soft)"
        strokeOpacity="0.35"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M82 112 C 92 90 96 66 105 49"
        fill="none"
        stroke="#fffdfb"
        strokeWidth="5.5"
        strokeLinecap="round"
      />
      {/* head */}
      <circle
        cx="106"
        cy="47"
        r="6"
        fill="#fffdfb"
        stroke="var(--inv-ink-soft)"
        strokeOpacity="0.35"
        strokeWidth="1"
      />
      {/* beak reaching toward its mate */}
      <path d="M110 44 l 8 -3 l -6 6 z" fill="var(--inv-gold)" />
    </g>
  );
}

/**
 * Two swans facing one another, their necks curving into the twin humps of
 * a heart above a still lake — the romantic footer of the hero reveal
 * (assets/envelope.mp4). The right swan is a mirror of the left; a faint
 * inverted copy suggests the water's reflection.
 */
export function SwanPair({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 220 190"
      className={className}
      aria-hidden="true"
    >
      {/* water line */}
      <line
        x1="10"
        y1="136"
        x2="210"
        y2="136"
        stroke="var(--inv-line)"
        strokeWidth="1"
        opacity="0.7"
      />

      {/* reflection */}
      <g transform="translate(0 272) scale(1 -1)" opacity="0.14">
        <Swan />
        <g transform="translate(220 0) scale(-1 1)">
          <Swan />
        </g>
      </g>

      {/* the pair */}
      <Swan />
      <g transform="translate(220 0) scale(-1 1)">
        <Swan />
      </g>
    </svg>
  );
}
