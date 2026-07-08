"use client";

import { useEffect, useState } from "react";

import { SectionTitle } from "../decor/section-title";
import { Reveal } from "../reveal";
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

/**
 * "يبدأ الاحتفال بعد" — a live countdown to the ceremony over a soft
 * watercolour horizon (assets/envelope.mp4). Ticks client-side only, so the
 * initial paint stays SSR-safe until mounted.
 */
export function CountdownSection({ invitation }: { invitation: Invitation }) {
  const target = new Date(`${invitation.date}T18:00:00`).getTime();
  const [parts, setParts] = useState<Parts | null>(null);

  useEffect(() => {
    // First paint stays SSR-safe (placeholder zeros); seed on the next frame
    // to avoid a synchronous setState in the effect body, then tick each second.
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
    <section className="relative w-full overflow-hidden px-6 py-20">
      {/* watercolour hills */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, var(--inv-cream) 0%, var(--inv-cream-deep) 100%)",
        }}
      />
      <svg
        className="pointer-events-none absolute bottom-0 left-0 h-40 w-full"
        viewBox="0 0 400 160"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0 90 Q 120 40 220 80 T 400 70 V 160 H 0 Z"
          fill="var(--inv-paper)"
          opacity="0.5"
        />
        <path
          d="M0 120 Q 140 80 260 110 T 400 100 V 160 H 0 Z"
          fill="var(--inv-paper-deep)"
          opacity="0.5"
        />
      </svg>

      <Reveal className="relative mx-auto max-w-md text-center">
        <SectionTitle>يبدأ الاحتفال بعد</SectionTitle>

        <div className="mt-10 flex items-start justify-center gap-2 sm:gap-4" dir="ltr">
          {cells.map((c, i) => (
            <div key={c.label} className="flex items-start">
              <div className="flex w-16 flex-col items-center sm:w-20">
                <span className="font-heading text-4xl tabular-nums text-[var(--inv-wine)] sm:text-5xl">
                  {toArabic(c.value, c.pad)}
                </span>
                <span className="mt-2 font-sans text-xs text-[var(--inv-ink-soft)]">
                  {c.label}
                </span>
              </div>
              {i < cells.length - 1 && (
                <span className="pt-1 font-heading text-3xl text-[var(--inv-gold)] sm:text-4xl">
                  :
                </span>
              )}
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
