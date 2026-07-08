"use client";

import { motion } from "framer-motion";
import { ChevronsUp } from "lucide-react";

import { WaxSeal } from "./wax-seal";
import { DamaskTexture } from "./decor/damask-texture";
import { EASE_LUX } from "../lib/anim";
import type { Invitation } from "@/types/invitation";

/**
 * The closed envelope that greets every guest — a single, physically-plausible
 * blush envelope resting on a warm, petal-lit backdrop. Tapping the wax seal
 * breaks it away, the triangular flap peels back in real 3-D, and the
 * invitation card rises up out of the pocket before the whole thing zooms
 * forward and dissolves into the reveal beneath. Presented as an overlay so
 * the hero is already waiting behind it. Reference: assets/envelope.mp4.
 */
export function EnvelopeGate({
  invitation,
  isOpening,
  onOpen,
}: {
  invitation: Invitation;
  isOpening: boolean;
  onOpen: () => void;
}) {
  const monogram = `${invitation.groomName.charAt(0)} · ${invitation.brideName.charAt(0)}`;

  // Shared blush-paper fill for every face of the envelope.
  const paper = {
    background:
      "radial-gradient(130% 130% at 50% 30%, var(--inv-paper-light) 0%, var(--inv-paper) 48%, var(--inv-paper-deep) 100%)",
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{ perspective: 1500 }}
      initial={false}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
    >
      {/* warm, dim backdrop with a soft bloom cradling the envelope */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 42%, #4a1a24 0%, var(--inv-night) 55%, #24070f 100%)",
        }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(244,214,155,0.28) 0%, transparent 62%)",
        }}
        initial={false}
        animate={{ opacity: isOpening ? [0.6, 1, 0.4] : 0.55, scale: isOpening ? 1.6 : 1 }}
        transition={{ duration: 1.6, ease: "easeOut" }}
      />

      {/* the envelope + its card */}
      <motion.div
        className="relative aspect-[3/2.05] w-[min(86vw,360px)]"
        style={{ transformStyle: "preserve-3d" }}
        initial={false}
        animate={{ scale: isOpening ? 1.09 : 1, y: isOpening ? "-4%" : "0%" }}
        transition={{ duration: 1.1, ease: EASE_LUX, delay: isOpening ? 1.7 : 0 }}
      >
        {/* drop shadow the whole envelope casts on the backdrop */}
        <div
          className="absolute inset-x-6 bottom-2 top-10 rounded-[14px]"
          style={{ boxShadow: "0 40px 70px -30px rgba(0,0,0,0.7)" }}
        />

        {/* back wall of the envelope */}
        <div
          className="absolute inset-0 overflow-hidden rounded-[14px] ring-1 ring-black/10"
          style={paper}
        >
          <DamaskTexture className="absolute inset-0 h-full w-full" opacity={0.5} />
        </div>

        {/* the invitation card, tucked in — rises out on open */}
        <motion.div
          className="absolute inset-x-[13%] bottom-[7%] top-[9%] z-10 overflow-hidden rounded-[10px] border border-[var(--inv-line)] bg-[var(--inv-cream)]"
          style={{ boxShadow: "0 18px 34px -18px rgba(0,0,0,0.55)" }}
          initial={false}
          animate={{ y: isOpening ? "-84%" : "0%" }}
          transition={{ duration: 0.9, ease: EASE_LUX, delay: isOpening ? 0.6 : 0 }}
        >
          <div className="flex h-full flex-col items-center justify-center px-5 text-center">
            <p className="font-sans text-[10px] tracking-[0.34em] text-[var(--inv-ink-soft)]">
              دعوة زفاف
            </p>
            <p className="mt-4 inv-foil inv-foil-anim font-heading text-2xl leading-none">
              {invitation.groomName}
            </p>
            <span className="my-2 flex items-center gap-2 text-[var(--inv-gold)]">
              <span className="h-px w-6 bg-[var(--inv-gold)]/60" />
              <span className="font-heading text-sm">&amp;</span>
              <span className="h-px w-6 bg-[var(--inv-gold)]/60" />
            </span>
            <p className="inv-foil inv-foil-anim font-heading text-2xl leading-none">
              {invitation.brideName}
            </p>
            <p className="mt-4 font-sans text-[11px] tracking-[0.2em] text-[var(--inv-ink-soft)]">
              {invitation.dateDisplay}
            </p>
          </div>
        </motion.div>

        {/* front pocket — three static flaps meeting at the middle (z-20) */}
        {(
          [
            "polygon(0% 100%, 100% 100%, 50% 50%)", // bottom
            "polygon(0% 0%, 0% 100%, 50% 50%)", // left
            "polygon(100% 0%, 100% 100%, 50% 50%)", // right
          ] as const
        ).map((clip, i) => (
          <div
            key={i}
            className="absolute inset-0 z-20 rounded-[14px]"
            style={{ ...paper, clipPath: clip }}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  i === 0
                    ? "linear-gradient(180deg, transparent 40%, rgba(60,30,34,0.10))"
                    : "linear-gradient(90deg, rgba(60,30,34,0.06), transparent 60%)",
              }}
            />
          </div>
        ))}
        {/* gilt seam tracing the pocket opening */}
        <svg
          className="pointer-events-none absolute inset-0 z-20 h-full w-full"
          viewBox="0 0 100 68"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0 0 L50 34 L100 0 M0 68 L50 34 L100 68"
            fill="none"
            stroke="var(--inv-gold)"
            strokeOpacity="0.4"
            strokeWidth="0.4"
          />
        </svg>

        {/* the opening flap (top triangle, hinged along the top edge) */}
        <motion.div
          className="absolute inset-0 z-30 origin-top rounded-[14px]"
          style={{
            ...paper,
            clipPath: "polygon(0% 0%, 100% 0%, 50% 52%)",
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
          }}
          initial={false}
          animate={{ rotateX: isOpening ? -172 : 0 }}
          transition={{ duration: 0.95, ease: [0.5, 0, 0.2, 1], delay: isOpening ? 0.1 : 0 }}
        >
          <DamaskTexture className="absolute inset-0 h-full w-full" opacity={0.4} />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, rgba(255,244,238,0.16), rgba(60,30,34,0.12))" }}
          />
        </motion.div>

        {/* the wax seal at the flap tip — breaks away and lifts on open */}
        <motion.button
          type="button"
          onClick={onOpen}
          disabled={isOpening}
          aria-label="اضغط على الختم لفتح الدعوة"
          className="absolute left-1/2 top-[52%] z-40 -translate-x-1/2 -translate-y-1/2 outline-none"
          initial={false}
          animate={
            isOpening
              ? { scale: [1, 0.9, 1.15], y: -46, rotate: -14, opacity: [1, 1, 0] }
              : { scale: 1, y: 0, rotate: 0, opacity: 1 }
          }
          transition={{ duration: 0.75, ease: [0.4, 0, 0.2, 1] }}
          whileHover={isOpening ? undefined : { scale: 1.05 }}
          whileTap={isOpening ? undefined : { scale: 0.94 }}
        >
          {/* breathing halo inviting the tap */}
          <span
            className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full blur-xl"
            style={{
              background: "radial-gradient(circle, var(--inv-gold-glow) 0%, transparent 68%)",
              animation: isOpening ? "none" : "inv-breathe 2.6s ease-in-out infinite",
            }}
          />
          <WaxSeal
            className="h-[74px] w-[74px] drop-shadow-[0_10px_20px_rgba(60,15,25,0.5)]"
            monogram={monogram}
            monogramSize={22}
          />
        </motion.button>
      </motion.div>

      {/* tap hint */}
      <motion.div
        className="absolute bottom-[12%] left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 text-[var(--inv-gold-glow)]"
        initial={false}
        animate={{ opacity: isOpening ? 0 : [0, 1] }}
        transition={{ duration: isOpening ? 0.25 : 1.2, delay: isOpening ? 0 : 0.5 }}
      >
        <motion.span
          animate={{ y: isOpening ? 0 : [0, -5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronsUp className="size-5" />
        </motion.span>
        <span className="font-sans text-xs tracking-wide">اضغط على الختم لفتح الدعوة</span>
      </motion.div>
    </motion.div>
  );
}
