"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Check, Heart } from "lucide-react";

import { EASE_LUX } from "../../lib/anim";
import type { Invitation } from "@/types/invitation";

const fieldClass =
  "w-full rounded-xl border border-[var(--inv-line)] bg-white/70 px-4 py-3 font-sans text-[15px] text-[var(--inv-ink)] outline-none transition-all placeholder:text-[var(--inv-ink-soft)]/70 focus:border-[var(--inv-wine)]/50 focus:ring-2 focus:ring-[var(--inv-wine)]/15";

/**
 * The RSVP form, presented as a frosted card floating over a dimmed blur of
 * the invitation. No RSVP backend exists yet, so a successful submit resolves
 * to an in-place thank-you; wiring it to a route is a later step.
 */
export function RsvpForm({
  invitation,
  onClose,
}: {
  invitation: Invitation;
  onClose: () => void;
}) {
  const [sent, setSent] = useState(false);

  return (
    <motion.div
      className="inv fixed inset-0 z-[70] flex justify-center overflow-y-auto p-4 sm:items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* dimmed, blurred backdrop */}
      <button
        type="button"
        aria-label="إغلاق"
        onClick={onClose}
        className="fixed inset-0 -z-10 cursor-default bg-[var(--inv-night)]/55 backdrop-blur-sm"
      />

      <motion.div
        className="inv-glass my-auto w-full max-w-md rounded-3xl p-7 sm:p-8"
        initial={{ opacity: 0, y: 26, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 26, scale: 0.97 }}
        transition={{ duration: 0.45, ease: EASE_LUX }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="إغلاق"
          className="absolute left-5 top-5 flex size-9 items-center justify-center rounded-full border border-[var(--inv-line)] bg-white/70 text-[var(--inv-ink)] transition-colors hover:bg-white"
        >
          <X className="size-4" />
        </button>

        {sent ? (
          <div className="flex flex-col items-center py-6 text-center">
            <motion.span
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 16 }}
              className="flex size-16 items-center justify-center rounded-full bg-[var(--inv-wine)] text-[var(--inv-cream)] shadow-[0_14px_30px_-12px_rgba(87,24,38,0.8)]"
            >
              <Check className="size-7" />
            </motion.span>
            <h2 className="mt-6 inv-foil font-heading text-3xl">شكرًا لتأكيدكم</h2>
            <p className="mt-3 font-sans text-[15px] leading-loose text-[var(--inv-ink)]">
              سُجّل ردّكم بنجاح، ونتطلّع لرؤيتكم في هذه المناسبة الغالية.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-8 rounded-full bg-[var(--inv-wine)] px-8 py-3 font-sans text-sm text-[var(--inv-cream)] transition-transform hover:scale-[1.02]"
            >
              العودة إلى الدعوة
            </button>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <div className="text-center">
              <span className="mx-auto mb-3 flex size-11 items-center justify-center rounded-full border border-[var(--inv-gold)]/40 text-[var(--inv-gold)]">
                <Heart className="size-5" />
              </span>
              <h2 className="inv-foil font-heading text-3xl">أكّدوا حضوركم</h2>
              {invitation.rsvpDeadline && (
                <p className="mt-2 font-sans text-sm text-[var(--inv-ink-soft)]">
                  يرجى التأكيد قبل {invitation.rsvpDeadline}
                </p>
              )}
            </div>

            <div className="mt-8 space-y-6">
              <div>
                <label className="mb-2 block font-sans text-sm text-[var(--inv-ink)]">الاسم</label>
                <input required name="name" className={fieldClass} placeholder="الاسم الكامل" />
              </div>

              <fieldset>
                <legend className="mb-2 font-sans text-sm text-[var(--inv-ink)]">
                  هل ستحضرون؟
                </legend>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { v: "yes", label: "نقبل بكل سرور" },
                    { v: "no", label: "نعتذر بأسف" },
                  ].map((o) => (
                    <label
                      key={o.v}
                      className="flex cursor-pointer items-center justify-center rounded-xl border border-[var(--inv-line)] bg-white/50 px-4 py-3 text-center font-sans text-[15px] text-[var(--inv-ink)] transition-all has-[:checked]:border-[var(--inv-wine)] has-[:checked]:bg-[var(--inv-wine)]/8 has-[:checked]:text-[var(--inv-wine)] has-[:checked]:shadow-[0_8px_20px_-12px_rgba(87,24,38,0.7)]"
                    >
                      <input
                        type="radio"
                        name="attending"
                        value={o.v}
                        required
                        className="sr-only"
                      />
                      {o.label}
                    </label>
                  ))}
                </div>
              </fieldset>

              <div>
                <label className="mb-2 block font-sans text-sm text-[var(--inv-ink)]">
                  عدد المرافقين
                </label>
                <input type="number" min={0} name="guests" className={fieldClass} placeholder="٠" />
              </div>

              <div>
                <label className="mb-2 block font-sans text-sm text-[var(--inv-ink)]">
                  أغنية تُدخلكم أجواء الرقص
                </label>
                <input name="song" className={fieldClass} placeholder="اسم الأغنية" />
              </div>

              <div>
                <label className="mb-1 block font-sans text-sm text-[var(--inv-ink)]">
                  الأطفال المرافقون
                </label>
                <p className="mb-2 font-sans text-xs text-[var(--inv-ink-soft)]">
                  يرجى ذكر الأسماء والأعمار
                </p>
                <textarea rows={2} name="children" className={fieldClass} />
              </div>
            </div>

            <button
              type="submit"
              className="mt-8 w-full rounded-full bg-[var(--inv-wine)] py-4 font-sans text-base text-[var(--inv-cream)] shadow-[0_14px_30px_-12px_rgba(87,24,38,0.7)] transition-transform hover:scale-[1.01] active:scale-[0.99]"
            >
              إرسال التأكيد
            </button>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}
