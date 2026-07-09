"use client";

import { useEffect } from "react";
import { useMotionValue, useReducedMotion } from "framer-motion";

/**
 * Offsets a layer by up to `strength` pixels as the pointer crosses the
 * viewport, so the light behind the names shifts as you move.
 *
 * Desktop only: on a touch screen there is no hovering pointer to follow,
 * and a `pointermove` there would mean the user is mid-scroll.
 */
export function usePointerParallax(strength: number) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let frame = 0;
    const onPointerMove = (event: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        x.set((event.clientX / window.innerWidth - 0.5) * strength);
        y.set((event.clientY / window.innerHeight - 0.5) * strength);
      });
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      cancelAnimationFrame(frame);
    };
  }, [reduceMotion, strength, x, y]);

  return { x, y };
}
