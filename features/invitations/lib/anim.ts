import type { Variants } from "framer-motion";

/**
 * Shared easing curves and motion variants for the invitation experience.
 * Keeping them in one place makes the whole scroll feel like a single hand —
 * every section rises and settles on the same luxurious curve.
 */

/** Gentle deceleration — the default entrance curve for sections. */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/** A softer, more cinematic settle for headline moments. */
export const EASE_LUX = [0.16, 1, 0.3, 1] as const;

/**
 * A container that reveals its children in a soft cascade when it first
 * scrolls into view. Pair with {@link riseItem} on each child.
 */
export const staggerParent: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

/** A child of {@link staggerParent} — fades and rises into place. */
export const riseItem: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE_OUT },
  },
};

/** Shared viewport config so every reveal fires once, a third of the way in. */
export const inView = { once: true, amount: 0.3 } as const;
