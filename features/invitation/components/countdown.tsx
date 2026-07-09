"use client";

import { useCountdown } from "../hooks/use-countdown";
import { toArabicPadded } from "../lib/arabic";

const LABELS = {
  days: "يوم",
  hours: "ساعة",
  mins: "دقيقة",
  secs: "ثانية",
} as const;

/**
 * Four bordered cells counting down to the ceremony. The grid runs LTR — days
 * on the left through seconds on the right — because that is the order a
 * clock is read in, in Arabic as in English.
 */
export function Countdown({ targetISO }: { targetISO: string }) {
  const countdown = useCountdown(targetISO);

  return (
    <div
      dir="ltr"
      className="ms-auto grid max-w-[400px] grid-cols-4 gap-2.5"
      aria-label="الوقت المتبقي"
    >
      {(Object.keys(LABELS) as (keyof typeof LABELS)[]).map((unit) => (
        <div
          key={unit}
          className="rounded-[2px] border border-gt-gold/[0.22] bg-gt-gold/[0.04] px-1.5 py-4 text-center"
        >
          <div className="text-[clamp(24px,7vw,34px)] font-light tabular-nums text-gt-gold">
            {toArabicPadded(countdown[unit])}
          </div>
          <div className="mt-2 text-[11px] tracking-[0.12em] text-gt-ink/55">
            {LABELS[unit]}
          </div>
        </div>
      ))}
    </div>
  );
}
