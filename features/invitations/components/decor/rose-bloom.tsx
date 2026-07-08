import { useId } from "react";

/**
 * A stylised garden rose — layered petals around a spiralled heart. Reused
 * as the "now" marker on the schedule timeline and as the focal bloom in
 * the floral sprays. Colour comes from the scoped rose tokens so a single
 * palette change restyles every bloom.
 */
export function RoseBloom({ className }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  const petal = "M50 50 C 37 41 39 21 50 15 C 61 21 63 41 50 50 Z";

  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <defs>
        <radialGradient id={`${id}-r`} cx="50%" cy="52%" r="52%">
          <stop offset="0%" stopColor="#f2d4ce" />
          <stop offset="55%" stopColor="var(--inv-rose)" />
          <stop offset="100%" stopColor="var(--inv-rose-deep)" />
        </radialGradient>
      </defs>

      <g fill={`url(#${id}-r)`} stroke="var(--inv-rose-deep)" strokeWidth="0.6" strokeOpacity="0.5">
        {/* outer ring */}
        {[0, 60, 120, 180, 240, 300].map((a) => (
          <path key={`o${a}`} d={petal} transform={`rotate(${a} 50 50)`} />
        ))}
        {/* inner ring, tucked in */}
        <g transform="translate(50 50) scale(0.62) translate(-50 -50)">
          {[30, 102, 174, 246, 318].map((a) => (
            <path key={`i${a}`} d={petal} transform={`rotate(${a} 50 50)`} />
          ))}
        </g>
      </g>

      {/* spiralled heart of the rose */}
      <path
        d="M50 50 q -6 -4 -3 -10 q 3 -6 10 -4 q 7 3 4 11"
        fill="none"
        stroke="var(--inv-rose-deep)"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.75"
      />
    </svg>
  );
}
