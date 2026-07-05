import { designSystem } from "./design-system";

export const motion = {
  fast: {
    duration: designSystem.animation.fast,
    ease: "easeOut",
  },

  normal: {
    duration: designSystem.animation.normal,
    ease: "easeOut",
  },

  luxury: {
    duration: designSystem.animation.luxury,
    ease: [0.22, 1, 0.36, 1],
  },

  cinematic: {
    duration: designSystem.animation.cinematic,
    ease: [0.16, 1, 0.3, 1],
  },
} as const;