"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * The jewel — a slowly turning faceted crystal, the centrepiece of the `gem`
 * layout. It is built entirely in CSS 3D (no WebGL): three faceted discs set at
 * 60° to one another inside a `preserve-3d` box that rotates on its Y axis, so
 * the discs foreshorten into thin bright edges and swell back to full faces as
 * they turn — reading as a single stone catching light from every angle. A lit
 * "heart" glows at the centre, an aura blooms behind it, and a soft caustic
 * pools beneath.
 *
 * All colour comes from the active palette's gold (`--gt-gold-*`), so the jewel
 * belongs to whichever theme the couple picked. Under reduced motion it simply
 * holds still — a static crystal is no less a crystal.
 */
export function GemJewel({
  size = "clamp(140px, 36vw, 216px)",
}: {
  /** Any CSS length; the jewel is square. */
  size?: string;
}) {
  const reduceMotion = useReducedMotion();

  // Alternating light/deep wedges around the disc read as cut facets.
  const facetCount = 16;
  const facets = Array.from({ length: facetCount }, (_, i) => {
    const a0 = (360 / facetCount) * i;
    const a1 = (360 / facetCount) * (i + 1);
    const colour = i % 2 ? "var(--gt-gold-deep)" : "var(--gt-gold-light)";
    return `${colour} ${a0}deg ${a1}deg`;
  }).join(", ");

  return (
    <div
      className="relative grid place-items-center"
      style={{ width: size, height: size }}
    >
      {/* aura — the stone's glow spilling past its edge */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-28%] rounded-full"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--gt-gold-light) 50%, transparent), transparent 68%)",
          filter: "blur(16px)",
        }}
      />

      <div
        className="relative"
        style={{ width: size, height: size, perspective: 820 }}
      >
        <motion.div
          className="absolute inset-0"
          style={{ transformStyle: "preserve-3d", rotateX: -14 }}
          animate={reduceMotion ? undefined : { rotateY: 360 }}
          transition={
            reduceMotion
              ? undefined
              : { duration: 18, ease: "linear", repeat: Infinity }
          }
        >
          {[0, 60, 120].map((deg) => (
            <span
              key={deg}
              aria-hidden="true"
              className="absolute inset-0 rounded-full"
              style={{
                transform: `rotateY(${deg}deg)`,
                background: `conic-gradient(from 90deg, ${facets})`,
                boxShadow:
                  "inset 0 0 26px rgba(255,255,255,.28), inset 0 0 8px rgba(255,255,255,.4)",
                opacity: 0.82,
                backfaceVisibility: "hidden",
              }}
            />
          ))}

          {/* a specular glint, held near the top so the turn catches it */}
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 36% 28%, rgba(255,255,255,.85), transparent 42%)",
              opacity: 0.7,
            }}
          />

          {/* the lit heart of the stone */}
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 size-[36%] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 40% 34%, #fff, var(--gt-gold-light) 46%, var(--gt-gold-deep) 82%)",
              boxShadow: "0 0 22px var(--gt-gold-light)",
            }}
          />
        </motion.div>
      </div>

      {/* caustic — the pool of gold light the stone throws below itself */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[6%] h-[9%] w-[68%] rounded-[50%]"
        style={{
          background:
            "radial-gradient(ellipse, color-mix(in srgb, var(--gt-gold) 42%, transparent), transparent 70%)",
          filter: "blur(7px)",
        }}
      />
    </div>
  );
}
