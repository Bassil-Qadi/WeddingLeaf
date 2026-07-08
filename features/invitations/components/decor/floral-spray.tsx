import { RoseBloom } from "./rose-bloom";

/**
 * A corner spray of roses, buds and foliage. Composed rather than a single
 * flat drawing so it recolours with the palette and scales cleanly. Drop it
 * into any corner and orient it with `flip`; used to frame the hero arch,
 * the blessing header and the dress-code / gift section (assets/envelope.mp4).
 *
 * The foliage is one SVG; the focal roses are layered as separate <RoseBloom>
 * elements so each keeps its own gradient ids and depth.
 */
export function FloralSpray({
  className,
  flip = false,
}: {
  className?: string;
  /** Mirror horizontally so the spray hugs the opposite corner. */
  flip?: boolean;
}) {
  return (
    <div
      className={`relative ${className ?? ""}`}
      aria-hidden="true"
      style={{ transform: flip ? "scaleX(-1)" : undefined }}
    >
      {/* foliage bed */}
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full">
        <g
          fill="none"
          stroke="var(--inv-sage-deep)"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.8"
        >
          <path d="M6 8 C 40 30, 70 40, 112 44" />
          <path d="M6 8 C 30 44, 44 78, 52 122" />
          <path d="M6 8 C 60 18, 100 20, 144 16" />
        </g>

        <g fill="var(--inv-sage)" opacity="0.9">
          {[
            [64, 40, 20],
            [92, 44, 35],
            [34, 64, 70],
            [48, 100, 80],
            [120, 26, 12],
            [78, 24, 24],
          ].map(([x, y, r], i) => (
            <ellipse
              key={i}
              cx={x}
              cy={y}
              rx="12"
              ry="5"
              transform={`rotate(${r} ${x} ${y})`}
            />
          ))}
        </g>
        <g fill="var(--inv-sage-deep)" opacity="0.5">
          {[
            [70, 34, 18],
            [40, 82, 74],
            [104, 22, 14],
          ].map(([x, y, r], i) => (
            <ellipse
              key={i}
              cx={x}
              cy={y}
              rx="8"
              ry="3.5"
              transform={`rotate(${r} ${x} ${y})`}
            />
          ))}
        </g>

        <g fill="var(--inv-rose)">
          <circle cx="126" cy="46" r="5" />
          <circle cx="54" cy="130" r="5" />
        </g>
      </svg>

      {/* focal roses */}
      <RoseBloom className="absolute left-[1%] top-[1%] h-[36%] w-[36%]" />
      <RoseBloom className="absolute left-[27%] top-[16%] h-[25%] w-[25%]" />
      <RoseBloom className="absolute left-[5%] top-[42%] h-[21%] w-[21%]" />
    </div>
  );
}
