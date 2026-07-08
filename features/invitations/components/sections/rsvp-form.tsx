"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Check } from "lucide-react";

import type { Invitation } from "@/types/invitation";

const fieldClass =
  "w-full rounded-xl border border-[var(--inv-line)] bg-white/60 px-4 py-3 font-sans text-[15px] text-[var(--inv-ink)] outline-none transition-colors placeholder:text-[var(--inv-ink-soft)]/70 focus:border-[var(--inv-wine)]/50 focus:ring-2 focus:ring-[var(--inv-wine)]/15";

/**
 * The RSVP form, presented as a full-screen modal over the invitation
 * (assets/envelope.mp4). No RSVP backend exists yet, so a successful submit
 * resolves to an in-place thank-you; wiring it to a route is a later step.
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
      className="inv fixed inset-0 z-[60] flex justify-center overflow-y-auto bg-[var(--inv-cream)] px-6 py-10"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="إغلاق"
        className="fixed left-5 top-5 z-10 flex size-9 items-center justify-center rounded-full border border-[var(--inv-line)] bg-white/70 text-[var(--inv-ink)] transition-colors hover:bg-white"
      >
        <X className="size-4" />
      </button>

      {sent ? (
        <div className="flex max-w-sm flex-col items-center justify-center text-center">
          <span className="flex size-16 items-center justify-center rounded-full bg-[var(--inv-wine)] text-white">
            <Check className="size-7" />
          </span>
          <h2 className="mt-6 font-heading text-3xl text-[var(--inv-script)]">
            شكرًا لتأكيدكم
          </h2>
          <p className="mt-3 font-sans text-[15px] leading-loose text-[var(--inv-ink)]">
            سُجّل ردّكم بنجاح، ونتطلع لرؤيتكم في هذه المناسبة الغالية.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mt-8 rounded-full bg-[var(--inv-wine)] px-8 py-3 font-sans text-sm text-white transition-transform hover:scale-[1.02]"
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
          className="w-full max-w-md pt-6"
        >
          <div className="text-center">
            <h2 className="font-heading text-3xl text-[var(--inv-script)]">
              أكّدوا حضوركم
            </h2>
            {invitation.rsvpDeadline && (
              <p className="mt-2 font-sans text-sm text-[var(--inv-ink-soft)]">
                يرجى التأكيد قبل {invitation.rsvpDeadline}
              </p>
            )}
          </div>

          <div className="mt-8 space-y-6">
            <div>
              <label className="mb-2 block font-sans text-sm text-[var(--inv-ink)]">
                الاسم
              </label>
              <input required name="name" className={fieldClass} placeholder="الاسم الكامل" />
            </div>

            <fieldset>
              <legend className="mb-2 font-sans text-sm text-[var(--inv-ink)]">
                هل ستحضرون؟
              </legend>
              <div className="space-y-2">
                {[
                  { v: "yes", label: "نقبل بكل سرور" },
                  { v: "no", label: "نعتذر بأسف" },
                ].map((o) => (
                  <label
                    key={o.v}
                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--inv-line)] bg-white/50 px-4 py-3 font-sans text-[15px] text-[var(--inv-ink)] transition-colors has-[:checked]:border-[var(--inv-wine)]/50 has-[:checked]:bg-[var(--inv-wine)]/5"
                  >
                    <input
                      type="radio"
                      name="attending"
                      value={o.v}
                      required
                      className="size-4 accent-[var(--inv-wine)]"
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
              <input
                type="number"
                min={0}
                name="guests"
                className={fieldClass}
                placeholder="٠"
              />
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
            className="mt-8 w-full rounded-full bg-[var(--inv-wine)] py-4 font-sans text-base text-white shadow-[0_14px_30px_-12px_rgba(87,24,38,0.7)] transition-transform hover:scale-[1.01] active:scale-[0.99]"
          >
            إرسال
          </button>
        </form>
      )}
    </motion.div>
  );
}
