"use client";

import { useId } from "react";

interface WaxSealProps {
  className?: string;
  /** Short text pressed into the wax — e.g. couple initials "أ · ل" or "RSVP". */
  monogram?: string;
  /** Font size of the monogram, in the 0–120 viewBox scale. */
  monogramSize?: number;
}

/**
 * A glossy burgundy wax seal, pressed with the couple's monogram — the
 * centrepiece of the closed envelope and the RSVP call-to-action
 * (assets/envelope.mp4). The organic, slightly-uneven wax edge is produced
 * with a turbulence displacement filter rather than a plain circle, and a
 * soft specular highlight gives the wax its wet sheen. A hairline gold rim
 * catches the warm light spilling from the envelope seams.
 */
export function WaxSeal({
  className,
  monogram,
  monogramSize = 30,
}: WaxSealProps) {
  const id = useId().replace(/:/g, "");

  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      role="img"
      aria-label={monogram ? `ختم شمعي: ${monogram}` : "ختم الدعوة الشمعي"}
    >
      <defs>
        <radialGradient id={`${id}-wax`} cx="38%" cy="32%" r="72%">
          <stop offset="0%" stopColor="#a8414e" />
          <stop offset="45%" stopColor="var(--inv-wine-light)" />
          <stop offset="100%" stopColor="#43101c" />
        </radialGradient>

        <radialGradient id={`${id}-gloss`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffd9c9" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#ffd9c9" stopOpacity="0" />
        </radialGradient>

        {/* organic, hand-pressed wax edge */}
        <filter id={`${id}-edge`} x="-25%" y="-25%" width="150%" height="150%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.028"
            numOctaves="2"
            seed="7"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="7"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        {/* soft drop shadow beneath the wax */}
        <filter id={`${id}-shadow`} x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow
            dx="0"
            dy="3"
            stdDeviation="4"
            floodColor="#3a0d15"
            floodOpacity="0.45"
          />
        </filter>
      </defs>

      <g filter={`url(#${id}-shadow)`}>
        <g filter={`url(#${id}-edge)`}>
          <circle cx="60" cy="60" r="50" fill={`url(#${id}-wax)`} />
          {/* gold rim */}
          <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke="var(--inv-gold)"
            strokeOpacity="0.65"
            strokeWidth="1.4"
          />
          {/* inner pressed groove */}
          <circle
            cx="60"
            cy="60"
            r="40"
            fill="none"
            stroke="#3a0d15"
            strokeOpacity="0.5"
            strokeWidth="1.6"
          />
          <circle
            cx="60"
            cy="60"
            r="40"
            fill="none"
            stroke="var(--inv-gold)"
            strokeOpacity="0.35"
            strokeWidth="0.8"
          />
        </g>

        {/* wet-sheen highlight, top-left */}
        <ellipse
          cx="45"
          cy="42"
          rx="24"
          ry="16"
          fill={`url(#${id}-gloss)`}
          transform="rotate(-25 45 42)"
        />

        {monogram && (
          <text
            x="60"
            y="60"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={monogramSize}
            fill="#f5e4d8"
            style={{
              fontFamily: "var(--font-amiri), serif",
              letterSpacing: "0.04em",
            }}
          >
            {monogram}
          </text>
        )}

        {/* tiny laurel sprig beneath the monogram */}
        {monogram && (
          <g
            stroke="#f5e4d8"
            strokeOpacity="0.7"
            strokeWidth="1.1"
            strokeLinecap="round"
            fill="none"
          >
            <path d="M52 80 q 4 4 8 4 q 4 0 8 -4" />
            <path d="M55 81 l -1.5 -3 M60 83 l 0 -3.5 M65 81 l 1.5 -3" />
          </g>
        )}
      </g>
    </svg>
  );
}
