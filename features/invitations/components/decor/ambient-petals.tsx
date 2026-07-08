"use client";

import { useMemo } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * A slow, ambient drift of rose petals and gold dust over the whole
 * invitation — the touch that makes the page feel alive rather than static.
 *
 * Rendered as CSS-animated spans (not motion components) so hundreds of
 * frames stay on the compositor and never touch React. Every value is derived
 * deterministically from the petal index, so the server and client markup
 * match exactly and there is no hydration flicker. Honours reduced-motion.
 */

// Deterministic pseudo-random in [0, 1) — SSR-safe, seeded by index + salt.
function rand(i: number, salt: number) {
  const x = Math.sin((i + 1) * 12.9898 * salt) * 43758.5453;
  return x - Math.floor(x);
}

export function AmbientPetals({ count = 16 }: { count?: number }) {
  const reduce = useReducedMotion();

  const petals = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const gold = rand(i, 3.1) > 0.62;
        const size = gold ? 4 + rand(i, 1.7) * 5 : 9 + rand(i, 2.3) * 12;
        return {
          gold,
          size,
          left: rand(i, 5.2) * 100,
          delay: -rand(i, 7.9) * 18,
          duration: 15 + rand(i, 4.4) * 16,
          drift: `${(rand(i, 6.1) - 0.5) * 160}px`,
          spin: `${(rand(i, 8.3) - 0.5) * 720}deg`,
          opacity: gold ? 0.5 + rand(i, 9.1) * 0.4 : 0.28 + rand(i, 2.9) * 0.34,
          tilt: rand(i, 1.3) * 360,
        };
      }),
    [count],
  );

  if (reduce) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[5] overflow-hidden"
    >
      {petals.map((p, i) => (
        <span
          key={i}
          className="absolute top-0 block"
          style={
            {
              left: `${p.left}%`,
              width: p.size,
              height: p.gold ? p.size : p.size * 1.15,
              borderRadius: p.gold ? "9999px" : "100% 0 100% 0",
              background: p.gold
                ? "radial-gradient(circle at 35% 30%, var(--inv-gold-glow), var(--inv-gold) 70%)"
                : "linear-gradient(135deg, var(--inv-paper-light), var(--inv-rose) 55%, var(--inv-rose-deep))",
              boxShadow: p.gold
                ? "0 0 6px rgba(244,214,155,0.8)"
                : "0 4px 8px -4px rgba(184,123,115,0.5)",
              filter: p.gold ? "blur(0.3px)" : "none",
              transform: `rotate(${p.tilt}deg)`,
              animation: `inv-fall ${p.duration}s linear ${p.delay}s infinite`,
              "--petal-drift": p.drift,
              "--petal-spin": p.spin,
              "--petal-op": p.opacity,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
