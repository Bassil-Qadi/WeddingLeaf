"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { Reveal } from "../reveal";
import { EASE_LUX } from "../../lib/anim";
import type { Invitation } from "@/types/invitation";

const toArabic = (n: number, pad = 2) =>
  n
    .toString()
    .padStart(pad, "0")
    .replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)]);

interface Parts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function diff(target: number): Parts {
  const ms = Math.max(0, target - Date.now());
  const s = Math.floor(ms / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

/** A single flip-tile whose value rolls over vertically when it changes. */
function Cell({ label, value, pad = 2 }: { label: string; value: number; pad?: number }) {
  const text = toArabic(value, pad);
  return (
    <div className="flex flex-col items-center">
      <div
        className="relative flex h-20 w-[68px] items-center justify-center overflow-hidden rounded-2xl border border-[var(--inv-gold)]/25 sm:h-24 sm:w-20"
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.09), rgba(255,255,255,0.02))",
          boxShadow: "0 10px 30px -14px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.12)",
        }}
      >
        {/* seam across the middle of the flip tile */}
        <span className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-black/25" />
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={text}
            initial={{ y: "-70%", opacity: 0, rotateX: 55 }}
            animate={{ y: "0%", opacity: 1, rotateX: 0 }}
            exit={{ y: "70%", opacity: 0, rotateX: -55 }}
            transition={{ duration: 0.5, ease: EASE_LUX }}
            className="inv-foil font-heading text-4xl tabular-nums sm:text-5xl"
          >
            {text}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="mt-3 font-sans text-xs tracking-wide text-[var(--inv-gold-glow)]/80">
        {label}
      </span>
    </div>
  );
}

/**
 * "يبدأ الاحتفال بعد" — a live countdown to the ceremony rendered as gilt
 * flip-tiles over a dark, aurora-lit night. The dramatic centrepiece between
 * the cream sections; ticks client-side only so first paint stays SSR-safe.
 */
export function CountdownSection({ invitation }: { invitation: Invitation }) {
  const target = new Date(`${invitation.date}T18:00:00`).getTime();
  const [parts, setParts] = useState<Parts | null>(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setParts(diff(target)));
    const id = setInterval(() => setParts(diff(target)), 1000);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(id);
    };
  }, [target]);

  const cells: Array<{ label: string; value: number; pad?: number }> = [
    { label: "يوم", value: parts?.days ?? 0, pad: 3 },
    { label: "ساعة", value: parts?.hours ?? 0 },
    { label: "دقيقة", value: parts?.minutes ?? 0 },
    { label: "ثانية", value: parts?.seconds ?? 0 },
  ];

  return (
    <section
      className="relative w-full overflow-hidden px-6 py-24"
      style={{ background: "var(--inv-night)" }}
    >
      {/* lazily panning aurora + vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 60% at 50% 40%, rgba(201,162,74,0.16), transparent 70%)",
          animation: "inv-aurora 16s ease-in-out infinite",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(120% 90% at 50% 50%, transparent 40%, rgba(0,0,0,0.5))" }}
      />
      {/* blend the seams into the neighbouring cream sections */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[var(--inv-cream)]/70 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[var(--inv-cream)]/70 to-transparent" />

      <Reveal className="relative mx-auto max-w-md text-center">
        <p className="font-sans text-xs tracking-[0.32em] text-[var(--inv-gold-glow)]/70">
          عدّ تنازلي
        </p>
        <h2 className="mt-3 inv-foil font-heading text-3xl sm:text-4xl">يبدأ الاحتفال بعد</h2>

        <div className="mt-12 flex items-start justify-center gap-3 sm:gap-4" dir="ltr">
          {cells.map((c) => (
            <Cell key={c.label} label={c.label} value={c.value} pad={c.pad} />
          ))}
        </div>
      </Reveal>
    </section>
  );
}
