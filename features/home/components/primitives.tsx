"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

/** The luxury reveal easing shared across the landing page. */
export const EASE = [0.22, 1, 0.36, 1] as const;

/** The gold ramp for gradient text — tuned to read on the ivory ground. */
const GOLD_GRADIENT =
  "linear-gradient(100deg, #9a7b3e 0%, #c6a86a 30%, #e7d3a1 50%, #c6a86a 70%, #9a7b3e 100%)";

/**
 * Rises its children into view the first time they scroll in. Under reduced
 * motion the content is simply there — the reveal carries no information.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.75, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** `— ◆ —` : two gold hairlines flanking a small open diamond. */
export function Ornament({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("flex items-center justify-center gap-3", className)}
    >
      <span className="h-px w-10 bg-gradient-to-r from-transparent to-primary/60" />
      <span className="size-1.5 rotate-45 border border-primary/70" />
      <span className="h-px w-10 bg-gradient-to-l from-transparent to-primary/60" />
    </span>
  );
}

/** A small tracked gold label sitting above a heading. */
export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-xs font-medium tracking-[0.34em] text-primary",
        className,
      )}
    >
      {children}
    </p>
  );
}

/**
 * Gold gradient text. `shimmer` sweeps the gradient across for the hero's
 * headline highlight; otherwise it sits still. Static under reduced motion.
 */
export function GoldText({
  children,
  className,
  shimmer,
}: {
  children: ReactNode;
  className?: string;
  shimmer?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.span
      className={cn("inline-block", className)}
      style={{
        backgroundImage: GOLD_GRADIENT,
        backgroundSize: "200% 100%",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
        color: "transparent",
      }}
      animate={
        shimmer && !reduceMotion
          ? { backgroundPositionX: ["0%", "-200%"] }
          : undefined
      }
      transition={
        shimmer && !reduceMotion
          ? { duration: 8, ease: "easeInOut", repeat: Infinity }
          : undefined
      }
    >
      {children}
    </motion.span>
  );
}

/** The centred eyebrow + ornament + heading + optional lede that opens a section. */
export function SectionHeading({
  eyebrow,
  title,
  lede,
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto max-w-2xl text-center", className)}>
      <Reveal>
        <Eyebrow>{eyebrow}</Eyebrow>
        <Ornament className="mt-4" />
        <h2 className="mt-5 font-heading text-4xl leading-tight text-foreground sm:text-5xl">
          {title}
        </h2>
        {lede && (
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
            {lede}
          </p>
        )}
      </Reveal>
    </div>
  );
}

/**
 * A field of soft, slowly drifting colour blooms — the warm glow that sits
 * behind a section without competing with its content. Held still under reduced
 * motion.
 */
export function AuroraField({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();
  const blooms = [
    {
      className: "left-[-10%] top-[-15%] size-[46vw] bg-primary/15",
      drift: { x: [0, 40, 0], y: [0, 26, 0] },
      duration: 22,
    },
    {
      className: "right-[-12%] top-[10%] size-[40vw] bg-secondary/12",
      drift: { x: [0, -32, 0], y: [0, 38, 0] },
      duration: 26,
    },
    {
      className: "bottom-[-20%] left-[20%] size-[42vw] bg-accent/12",
      drift: { x: [0, 30, 0], y: [0, -24, 0] },
      duration: 24,
    },
  ];
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      {blooms.map((bloom, i) => (
        <motion.span
          key={i}
          className={cn("absolute rounded-full blur-[120px]", bloom.className)}
          animate={reduceMotion ? undefined : bloom.drift}
          transition={
            reduceMotion
              ? undefined
              : { duration: bloom.duration, ease: "easeInOut", repeat: Infinity }
          }
        />
      ))}
    </div>
  );
}
