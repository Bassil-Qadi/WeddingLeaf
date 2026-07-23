"use client";

import type { PointerEvent } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

import { Ornament } from "./primitives";

/** Gold dust drifting around the card — hand-placed so it never clumps and
 * never differs between server and client. */
const MOTES = [
  { left: "8%", top: "18%", size: 5, duration: 7, delay: 0 },
  { left: "92%", top: "26%", size: 4, duration: 9, delay: 1.2 },
  { left: "4%", top: "70%", size: 4, duration: 8, delay: 0.6 },
  { left: "96%", top: "64%", size: 6, duration: 10, delay: 2 },
  { left: "18%", top: "94%", size: 4, duration: 8.5, delay: 1.6 },
  { left: "82%", top: "92%", size: 5, duration: 9.5, delay: 0.3 },
] as const;

/**
 * The hero's centrepiece — a mini wedding invitation that floats, tilts toward
 * the pointer, and glows on a bed of gold dust. It is a taste of the real
 * product's craft rather than a screenshot: the same Amiri names, hairline gold
 * ornament, and quiet card the guest-facing invitations are built from.
 *
 * Only a mouse drives the tilt; touch is left alone. Everything flattens under
 * `prefers-reduced-motion`.
 */
export function InvitationMockup() {
  const reduceMotion = useReducedMotion();

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 120, damping: 18 });
  const sy = useSpring(py, { stiffness: 120, damping: 18 });
  const rotateX = useTransform(sy, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-12, 12]);

  function handleMove(e: PointerEvent<HTMLDivElement>) {
    if (reduceMotion || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleLeave() {
    px.set(0);
    py.set(0);
  }

  return (
    <div
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className="relative mx-auto w-full max-w-[380px]"
      style={{ perspective: 1200 }}
    >
      {/* the glow the card sits in */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 rounded-full bg-primary/25 blur-[90px]"
      />

      {/* gold dust */}
      {!reduceMotion &&
        MOTES.map((mote) => (
          <motion.span
            key={mote.left + mote.top}
            aria-hidden="true"
            className="absolute rounded-full bg-primary/70"
            style={{
              left: mote.left,
              top: mote.top,
              width: mote.size,
              height: mote.size,
            }}
            animate={{ y: [0, -14, 0], opacity: [0.3, 0.9, 0.3] }}
            transition={{
              duration: mote.duration,
              ease: "easeInOut",
              repeat: Infinity,
              delay: mote.delay,
            }}
          />
        ))}

      <motion.div
        className="relative"
        style={{
          transformStyle: "preserve-3d",
          rotateX: reduceMotion ? 0 : rotateX,
          rotateY: reduceMotion ? 0 : rotateY,
        }}
        animate={reduceMotion ? undefined : { y: [0, -12, 0] }}
        transition={
          reduceMotion
            ? undefined
            : { duration: 6, ease: "easeInOut", repeat: Infinity }
        }
      >
        <div className="rounded-[26px] border border-primary/25 bg-white p-2.5 shadow-[0_40px_90px_-30px_rgba(120,90,30,0.45)]">
          {/* the inner printed frame */}
          <div className="relative overflow-hidden rounded-[18px] border border-primary/20 bg-[#fdfaf4] px-8 py-12 text-center">
            {/* corner accents */}
            <span
              aria-hidden="true"
              className="absolute left-3 top-3 size-5 border-l border-t border-primary/40"
            />
            <span
              aria-hidden="true"
              className="absolute right-3 top-3 size-5 border-r border-t border-primary/40"
            />
            <span
              aria-hidden="true"
              className="absolute bottom-3 left-3 size-5 border-b border-l border-primary/40"
            />
            <span
              aria-hidden="true"
              className="absolute bottom-3 right-3 size-5 border-b border-r border-primary/40"
            />

            <p className="font-serif text-[11px] uppercase tracking-[0.4em] text-primary">
              Save the Date
            </p>

            <h3 className="mt-6 font-heading text-5xl leading-[1.15] text-foreground">
              سارة
              <span className="mx-2 font-serif text-3xl italic text-primary">
                &amp;
              </span>
              <br />
              عمر
            </h3>

            <Ornament className="my-7" />

            <p className="text-sm tracking-[0.12em] text-muted-foreground">
              الجمعة ٢٠ يونيو ٢٠٢٧
            </p>
            <p className="mt-1.5 text-[13px] text-muted-foreground/80">
              عمّان · الأردن
            </p>

            <span className="mt-8 inline-flex items-center rounded-full border border-primary/40 bg-primary/5 px-6 py-2.5 text-[13px] text-primary">
              تأكيد الحضور
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
