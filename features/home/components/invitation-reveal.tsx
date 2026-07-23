"use client";

import type { PointerEvent, ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

import { cn } from "@/lib/utils";
import { EASE, Ornament } from "./primitives";

/**
 * The hero centrepiece — "طبقات النور", the invitation seen in depth.
 *
 * Rather than a wedding trinket, this is the product itself made tangible: an
 * invitation exploded into parallax layers — a faint monogram far behind, a
 * photo plane, the golden thread that runs through every WeddingLeaf story, the
 * names on their sheet, and the *live* moments a guest discovers (an RSVP
 * confirmation, a countdown). They assemble on load and slide against one
 * another as the cursor moves, so a visitor looks *into* an invitation and feels
 * the interactive experience before reading a word of copy.
 *
 * Built entirely from compositor transforms + framer-motion (no WebGL): the
 * parallax runs on motion values, so pointer movement never re-renders React.
 * Everything is composed to read intentionally in RTL, collapses to a lean,
 * deliberate arrangement on mobile, and settles into a still, finished
 * invitation under `prefers-reduced-motion`.
 */
export function InvitationReveal() {
  const reduce = useReducedMotion();

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 90, damping: 18, mass: 0.4 });
  const sy = useSpring(py, { stiffness: 90, damping: 18, mass: 0.4 });

  const rotateX = useTransform(sy, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-13, 13]);

  function handleMove(e: PointerEvent<HTMLDivElement>) {
    if (reduce || e.pointerType !== "mouse") return;
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
      className="relative mx-auto aspect-square w-full max-w-[460px]"
      style={{ perspective: 1200 }}
    >
      {/* the warm light the invitation hangs in */}
      <div
        aria-hidden="true"
        className="absolute inset-[16%] -z-10 rounded-full bg-primary/25 blur-[90px]"
      />

      <motion.div
        className="absolute inset-0"
        style={{
          transformStyle: "preserve-3d",
          rotateX: reduce ? 0 : rotateX,
          rotateY: reduce ? 0 : rotateY,
        }}
        animate={reduce ? undefined : { y: [0, -10, 0] }}
        transition={
          reduce ? undefined : { duration: 7, ease: "easeInOut", repeat: Infinity }
        }
      >
        {/* far monogram — the depth anchor */}
        <Layer sx={sx} sy={sy} depth={-170} factor={0.14} delay={0.15}>
          <span className="-translate-y-6 select-none font-heading text-[clamp(150px,42vw,200px)] leading-none text-primary/[0.06]">
            سع
          </span>
        </Layer>

        {/* photo plane, peeking from behind a corner */}
        <Layer
          sx={sx}
          sy={sy}
          depth={-95}
          factor={0.12}
          delay={0.4}
          layerClassName="hidden sm:grid"
        >
          <div className="translate-x-[118px] -translate-y-[122px]">
            <div className="relative h-40 w-32 rotate-[-6deg] overflow-hidden rounded-2xl border border-primary/25 shadow-[0_30px_50px_-30px_rgba(120,90,30,0.5)]">
              <div className="size-full bg-[radial-gradient(120%_100%_at_30%_20%,#f6e7cb,#e7c9a0_45%,#d7a58a_100%)]" />
              <span className="absolute left-2 top-2 size-4 border-l border-t border-white/70" />
              <span className="absolute bottom-2 right-2 size-4 border-b border-r border-white/70" />
            </div>
          </div>
        </Layer>

        {/* the golden thread — the WeddingLeaf story motif */}
        <Layer
          sx={sx}
          sy={sy}
          depth={-45}
          factor={0.1}
          delay={0.3}
          layerClassName="hidden sm:grid"
        >
          <div className="-translate-x-[142px]">
            <div className="relative h-[300px] w-px bg-gradient-to-b from-transparent via-primary/50 to-transparent">
              <ThreadNode className="top-[28%]" />
              <ThreadNode className="top-[60%]" />
            </div>
          </div>
        </Layer>

        {/* the invitation sheet */}
        <Layer sx={sx} sy={sy} depth={0} factor={0.06} delay={0.15}>
          <div className="relative w-[clamp(250px,72vw,292px)] overflow-hidden rounded-[24px] border border-primary/25 bg-[#fdfaf4]/92 px-9 py-10 text-center shadow-[0_60px_100px_-45px_rgba(120,90,30,0.55)] backdrop-blur-md">
            {/* top sheen */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 -top-16 h-32 bg-gradient-to-b from-white/55 to-transparent"
            />
            {/* corner accents */}
            <span className="absolute left-3.5 top-3.5 size-5 border-l border-t border-primary/35" />
            <span className="absolute right-3.5 top-3.5 size-5 border-r border-t border-primary/35" />
            <span className="absolute bottom-3.5 left-3.5 size-5 border-b border-l border-primary/35" />
            <span className="absolute bottom-3.5 right-3.5 size-5 border-b border-r border-primary/35" />

            <p className="font-serif text-[11px] uppercase tracking-[0.4em] text-primary">
              Save the Date
            </p>
            <h3 className="mt-6 font-heading text-5xl leading-[1.15] text-foreground">
              سارة
              <span className="mx-2 font-serif text-3xl italic text-primary">
                &amp;
              </span>
              عمر
            </h3>
            <Ornament className="my-6" />
            <p className="text-sm tracking-[0.12em] text-muted-foreground">
              الجمعة · ٢٠ يونيو ٢٠٢٧
            </p>
            <p className="mt-1.5 text-[13px] text-muted-foreground/80">
              عمّان · الأردن
            </p>
          </div>
        </Layer>

        {/* live moment — RSVP confirmed (front) */}
        <Layer sx={sx} sy={sy} depth={70} factor={0.16} delay={0.65}>
          <div className="-translate-x-[74px] translate-y-[150px]">
            <div className="flex items-center gap-2 rounded-full border border-primary/30 bg-white/85 px-4 py-2 text-[13px] text-foreground shadow-[0_18px_34px_-16px_rgba(120,90,30,0.55)] backdrop-blur-md">
              <span className="grid size-4 place-items-center rounded-full bg-primary text-[9px] leading-none text-primary-foreground">
                ✓
              </span>
              تم تأكيد الحضور
            </div>
          </div>
        </Layer>

        {/* live moment — countdown (front) */}
        <Layer
          sx={sx}
          sy={sy}
          depth={55}
          factor={0.14}
          delay={0.8}
          layerClassName="hidden sm:grid"
        >
          <div className="translate-x-[132px] translate-y-[136px]">
            <div className="rounded-2xl border border-primary/25 bg-white/85 px-4 py-3 text-center shadow-[0_18px_34px_-16px_rgba(120,90,30,0.55)] backdrop-blur-md">
              <p className="font-heading text-2xl leading-none text-foreground">
                ١٢
              </p>
              <p className="mt-1 text-[10px] tracking-[0.16em] text-muted-foreground">
                يومًا حتى الفرح
              </p>
            </div>
          </div>
        </Layer>

        <Dust reduce={Boolean(reduce)} />
      </motion.div>
    </div>
  );
}

/**
 * One parallax plane. Its content slides by an amount proportional to `depth`
 * (and against it, for planes in front), so the whole scene reads as real space.
 * Parallax rides on motion values — moving the pointer never re-renders React.
 * The one-time assemble animation lives on an inner element so it never fights
 * the parallax transform.
 */
function Layer({
  sx,
  sy,
  depth,
  factor = 0.1,
  delay = 0,
  layerClassName,
  children,
}: {
  sx: MotionValue<number>;
  sy: MotionValue<number>;
  depth: number;
  factor?: number;
  delay?: number;
  layerClassName?: string;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();
  const x = useTransform(sx, (v) => v * depth * factor);
  const y = useTransform(sy, (v) => v * depth * factor);

  return (
    <motion.div
      className={cn("absolute inset-0 grid place-items-center", layerClassName)}
      style={{
        x: reduce ? 0 : x,
        y: reduce ? 0 : y,
        z: depth,
        transformStyle: "preserve-3d",
      }}
    >
      <motion.div
        initial={
          reduce ? false : { opacity: 0, y: 22, scale: 0.97, filter: "blur(6px)" }
        }
        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 1, ease: EASE, delay }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

/** A small gold diamond node on the golden thread. */
function ThreadNode({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "absolute left-1/2 size-2 -translate-x-1/2 rotate-45 border border-primary/70 bg-background",
        className,
      )}
    />
  );
}

/** A little gold dust drifting in the very front — hand-placed, deterministic. */
const DUST = [
  { left: "22%", top: "26%", size: 5, duration: 7, delay: 0 },
  { left: "80%", top: "34%", size: 4, duration: 9, delay: 1.2 },
  { left: "16%", top: "70%", size: 4, duration: 8, delay: 0.6 },
  { left: "86%", top: "64%", size: 6, duration: 10, delay: 1.8 },
  { left: "50%", top: "90%", size: 4, duration: 8.5, delay: 1.4 },
] as const;

function Dust({ reduce }: { reduce: boolean }) {
  if (reduce) return null;
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0"
      style={{ transformStyle: "preserve-3d" }}
    >
      {DUST.map((mote) => (
        <motion.span
          key={mote.left + mote.top}
          className="absolute rounded-full bg-primary/70"
          style={{
            left: mote.left,
            top: mote.top,
            width: mote.size,
            height: mote.size,
            z: 90,
          }}
          animate={{ y: [0, -12, 0], opacity: [0.25, 0.85, 0.25] }}
          transition={{
            duration: mote.duration,
            ease: "easeInOut",
            repeat: Infinity,
            delay: mote.delay,
          }}
        />
      ))}
    </div>
  );
}
