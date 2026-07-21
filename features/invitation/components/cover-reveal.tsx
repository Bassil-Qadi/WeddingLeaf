"use client";

import { motion, useReducedMotion } from "framer-motion";
import { RotateCcw } from "lucide-react";

import type { CoverTreatment } from "@/types/invitation";
import type { ResolvedInvitation } from "../types";

/** The reveal easing the whole design is timed against (README "Motion"). */
const EASE = [0.7, 0, 0.15, 1] as const;

interface Durations {
  /** The main slide/lift of the cover. */
  reveal: number;
  /** The envelope flap folding back. */
  flap: number;
  /** Content fading out ahead of the reveal. */
  fade: number;
}

const FULL: Durations = { reveal: 1.6, flap: 0.95, fade: 0.5 };
const REDUCED: Durations = { reveal: 0.5, flap: 0.4, fade: 0.35 };

interface CoverProps {
  data: ResolvedInvitation;
  treatment: CoverTreatment;
  opened: boolean;
  onOpen: () => void;
  onReplay: () => void;
}

/**
 * Act 1 — the cover. A full-screen overlay above the story that plays a
 * cinematic opening on a single tap of the gold seal, then goes
 * `pointer-events:none` so the story beneath scrolls. A `↺` control re-closes
 * it so the opening can be replayed.
 *
 * The three treatments share the seal, the pulse rings, and the tap hint; they
 * differ only in the cover chrome and the reveal motion. The envelope tints with
 * the active palette (`--gt-paper`); the doors and veil stay deliberately dark
 * whatever the theme — as in the design — but take their gold from `--gt-gold`.
 */
export function CoverReveal({
  data,
  treatment,
  opened,
  onOpen,
  onReplay,
}: CoverProps) {
  const reduceMotion = useReducedMotion();
  const d = reduceMotion ? REDUCED : FULL;

  const Cover =
    treatment === "doors"
      ? Doors
      : treatment === "veil"
        ? Veil
        : Envelope;

  return (
    <>
      <Cover data={data} opened={opened} onOpen={onOpen} d={d} />

      {/* Lives outside the cover so it stays clickable once the cover is
          pointer-events:none. Only offered after the reveal. */}
      {opened && (
        <motion.button
          type="button"
          onClick={onReplay}
          aria-label="إعادة فتح الدعوة"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: reduceMotion ? 0 : 0.45 }}
          className="fixed end-4 top-5 z-[60] flex size-9 items-center justify-center rounded-full bg-black/45 text-white/90 backdrop-blur-sm transition-colors hover:bg-black/60"
        >
          <RotateCcw className="size-4" strokeWidth={1.75} />
        </motion.button>
      )}
    </>
  );
}

interface TreatmentProps {
  data: ResolvedInvitation;
  opened: boolean;
  onOpen: () => void;
  d: Durations;
}

/* --- Shared cover furniture ------------------------------------------------ */

/**
 * The gold wax seal, identical across treatments. Its gradient reads the active
 * palette's gold, so the seal belongs to whichever theme the couple picked.
 */
function Seal({
  label,
  onClick,
  hidden,
}: {
  label: string;
  onClick: () => void;
  /** Fades/shrinks away as the cover opens. */
  hidden: boolean;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label="افتح الدعوة"
      animate={{ opacity: hidden ? 0 : 1, scale: hidden ? 0.2 : 1 }}
      transition={{ duration: 0.5, ease: EASE }}
      whileTap={{ scale: 0.94 }}
      className="relative grid size-[92px] place-items-center rounded-full"
      style={{
        background:
          "radial-gradient(circle at 38% 32%, var(--gt-gold-light), var(--gt-gold-deep) 78%)",
        boxShadow:
          "0 10px 24px rgba(40,26,6,.4), inset 0 2px 3px rgba(255,255,255,.45), inset 0 -3px 6px rgba(40,26,6,.4)",
      }}
    >
      {!hidden && <Rings />}
      <span
        className="font-serif italic"
        style={{
          color: "#3a2a0e",
          fontSize: label.length > 3 ? 12 : 28,
          letterSpacing: label.length > 3 ? "0.24em" : undefined,
          fontStyle: label.length > 3 ? "normal" : "italic",
        }}
      >
        {label}
      </span>
    </motion.button>
  );
}

/** Two concentric rings breathing outward behind the seal. */
function Rings() {
  return (
    <>
      {[0, 1.3].map((delay) => (
        <motion.span
          key={delay}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-full border"
          style={{ borderColor: "color-mix(in srgb, var(--gt-gold) 60%, transparent)" }}
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: 1.55, opacity: 0 }}
          transition={{ duration: 2.6, ease: "easeOut", repeat: Infinity, delay }}
        />
      ))}
    </>
  );
}

/** The pulsing "tap to…" hint under the seal. Hidden once opening begins. */
function Hint({ text, hidden, tone }: { text: string; hidden: boolean; tone: string }) {
  return (
    <motion.p
      aria-hidden="true"
      animate={{ opacity: hidden ? 0 : [0.5, 1, 0.5] }}
      transition={
        hidden
          ? { duration: 0.3 }
          : { duration: 2, ease: "easeInOut", repeat: Infinity }
      }
      className="mt-6 text-[10px] uppercase [word-spacing:0.1em]"
      style={{ color: tone, letterSpacing: "0.3em" }}
    >
      {text}
    </motion.p>
  );
}

/* --- 1a · Envelope --------------------------------------------------------- */

function Envelope({ data, opened, onOpen, d }: TreatmentProps) {
  return (
    <motion.div
      className="fixed inset-0 z-[50] flex flex-col items-center justify-center overflow-hidden"
      style={{
        pointerEvents: opened ? "none" : "auto",
        background:
          "linear-gradient(158deg, color-mix(in srgb, var(--gt-paper) 94%, white), color-mix(in srgb, var(--gt-paper) 88%, black))",
      }}
      animate={{ y: opened ? "125%" : "0%" }}
      transition={{ duration: d.reveal, ease: EASE, delay: opened ? d.flap : 0 }}
    >
      {/* inset paper frame */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-[18px] rounded-[2px] border"
        style={{ borderColor: "color-mix(in srgb, var(--gt-gold) 45%, transparent)" }}
      />

      {/* the flap — a full-width triangle folding back from the top */}
      <div
        className="absolute inset-x-0 top-0"
        style={{ perspective: 1400, height: "44vh" }}
      >
        <motion.div
          className="h-full w-full origin-top"
          style={{
            clipPath: "polygon(0 0, 100% 0, 50% 100%)",
            background:
              "linear-gradient(158deg, color-mix(in srgb, var(--gt-paper) 88%, black), color-mix(in srgb, var(--gt-paper) 80%, black))",
            boxShadow: "0 8px 18px -6px rgba(40,26,6,.35)",
          }}
          animate={{ rotateX: opened ? -176 : 0 }}
          transition={{
            duration: d.flap,
            ease: EASE,
            delay: opened ? d.fade * 0.24 : 0,
          }}
        />
      </div>

      {/* the seal sits at the flap's tip */}
      <div className="absolute top-[calc(44vh-46px)] left-1/2 z-[2] flex -translate-x-1/2 flex-col items-center">
        <Seal label={data.monogram.replace(/\s+/g, "")} onClick={onOpen} hidden={opened} />
        <Hint
          text="المسوا الخاتم للفتح"
          hidden={opened}
          tone="color-mix(in srgb, var(--gt-ink) 55%, transparent)"
        />
      </div>

      {/* faint printed line near the bottom */}
      <div className="absolute inset-x-0 bottom-[13vh] flex flex-col items-center gap-2 text-center">
        <p
          className="text-[9px] uppercase"
          style={{
            letterSpacing: "0.34em",
            color: "color-mix(in srgb, var(--gt-ink) 40%, transparent)",
          }}
        >
          بشرف الحضور نتشرّف بدعوتكم
        </p>
        <p
          className="font-serif text-[24px] italic"
          style={{ color: "color-mix(in srgb, var(--gt-gold) 75%, transparent)" }}
        >
          {data.brideName} &amp; {data.groomName}
        </p>
      </div>
    </motion.div>
  );
}

/* --- 1b · Parting doors ---------------------------------------------------- */

function Doors({ data, opened, onOpen, d }: TreatmentProps) {
  const gold = "color-mix(in srgb, var(--gt-gold-light) 88%, white)";
  const doorTransition = { duration: d.reveal, ease: EASE };

  return (
    <div
      className="fixed inset-0 z-[50] overflow-hidden"
      style={{ pointerEvents: opened ? "none" : "auto" }}
    >
      {/* left door */}
      <motion.div
        className="absolute inset-y-0 left-0 w-1/2"
        style={{
          background: "linear-gradient(100deg, #232d27, #2e3a32)",
          borderRight: "1px solid rgba(176,137,79,.55)",
        }}
        animate={{ x: opened ? "-101%" : "0%" }}
        transition={doorTransition}
      >
        <span
          aria-hidden="true"
          className="absolute right-6 top-1/2 -translate-y-1/2 font-serif italic leading-none"
          style={{ fontSize: 150, color: "rgba(176,137,79,.14)" }}
        >
          {firstInitial(data.brideName)}
        </span>
      </motion.div>

      {/* right door */}
      <motion.div
        className="absolute inset-y-0 right-0 w-1/2"
        style={{
          background: "linear-gradient(260deg, #232d27, #2e3a32)",
          borderLeft: "1px solid rgba(176,137,79,.55)",
        }}
        animate={{ x: opened ? "101%" : "0%" }}
        transition={doorTransition}
      >
        <span
          aria-hidden="true"
          className="absolute left-6 top-1/2 -translate-y-1/2 font-serif italic leading-none"
          style={{ fontSize: 150, color: "rgba(176,137,79,.14)" }}
        >
          {firstInitial(data.groomName)}
        </span>
      </motion.div>

      {/* centre content — fades out as the doors part */}
      <motion.div
        className="absolute inset-0 z-[2] flex flex-col items-center justify-center px-6 text-center"
        animate={{ opacity: opened ? 0 : 1, scale: opened ? 0.94 : 1 }}
        transition={{ duration: d.fade, ease: EASE }}
        style={{ pointerEvents: opened ? "none" : "auto" }}
      >
        <p
          className="mb-6 text-[9px] uppercase"
          style={{ letterSpacing: "0.4em", color: "rgba(246,241,233,.6)" }}
        >
          يتشرّفون بدعوتكم لحضور زفاف
        </p>
        <h2 className="font-serif leading-[1.05] text-[#f6f1e9]">
          <span className="block text-[38px]">{data.brideName}</span>
          <span className="my-1 block text-[22px] italic" style={{ color: gold }}>
            &amp;
          </span>
          <span className="block text-[38px]">{data.groomName}</span>
        </h2>
        <div className="mt-8">
          <Seal label={data.monogram.replace(/\s+/g, "")} onClick={onOpen} hidden={opened} />
        </div>
        <Hint text="المسوا للدخول" hidden={opened} tone="rgba(216,184,120,.85)" />
      </motion.div>
    </div>
  );
}

/* --- 1c · Veil lift -------------------------------------------------------- */

function Veil({ data, opened, onOpen, d }: TreatmentProps) {
  const gold = "color-mix(in srgb, var(--gt-gold-light) 90%, white)";

  return (
    <motion.div
      className="fixed inset-0 z-[50] flex flex-col items-center justify-center overflow-hidden px-6 text-center"
      style={{
        pointerEvents: opened ? "none" : "auto",
        background: "linear-gradient(158deg, #2b2620, #201b16)",
      }}
      animate={{ y: opened ? "-102%" : "0%" }}
      transition={{ duration: d.reveal, ease: EASE, delay: opened ? d.fade * 0.5 : 0 }}
    >
      {/* diagonal sheen + inset frame */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(105deg, transparent 30%, rgba(216,184,120,.09) 50%, transparent 70%)",
        }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-[18px] rounded-[2px] border"
        style={{ borderColor: "rgba(176,137,79,.35)" }}
      />

      <motion.div
        className="relative z-[2] flex flex-col items-center"
        animate={{ opacity: opened ? 0 : 1, y: opened ? -12 : 0 }}
        transition={{ duration: d.fade, ease: EASE }}
        style={{ pointerEvents: opened ? "none" : "auto" }}
      >
        <p
          className="mb-6 text-[10px] uppercase"
          style={{ letterSpacing: "0.36em", color: "rgba(246,241,233,.55)" }}
        >
          بخالص المودّة، ندعوكم
        </p>
        <p className="font-serif text-[64px] leading-none" style={{ color: gold }}>
          {data.monogram.replace(/\s+/g, "")}
        </p>

        {/* gold diamond divider */}
        <span aria-hidden="true" className="my-7 flex items-center gap-3">
          <span className="h-px w-12" style={{ background: "rgba(176,137,79,.5)" }} />
          <span className="size-1.5 rotate-45" style={{ background: gold }} />
          <span className="h-px w-12" style={{ background: "rgba(176,137,79,.5)" }} />
        </span>

        <Seal label="افتح" onClick={onOpen} hidden={opened} />
        <Hint text="المسوا لرفع الستار" hidden={opened} tone="rgba(216,184,120,.8)" />
      </motion.div>
    </motion.div>
  );
}

/** First grapheme of a name — the giant faded letter behind each door. */
function firstInitial(name: string): string {
  return Array.from(name.trim())[0] ?? "";
}
