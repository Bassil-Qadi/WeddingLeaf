import type { Variants } from "framer-motion";

/** Content reveals — a confident settle, never a bounce. */
export const EASE_CONTENT: [number, number, number, number] = [0.2, 0.7, 0.2, 1];

/** The veil lift — slow to leave, fast through the middle, slow to land. */
export const EASE_VEIL: [number, number, number, number] = [0.76, 0, 0.24, 1];

/**
 * Everything in this experience arrives the same way: it rises 24px and
 * fades in. Chapters differ only in how long their elements wait.
 */
export function riseIn(delay = 0, duration = 1): Variants {
  return {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration, delay, ease: EASE_CONTENT },
    },
  };
}
