"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { ArrowLeft, CalendarPlus, ChevronDown, MailCheck, RotateCcw } from "lucide-react";

import type { InvitationData, ResolvedInvitation } from "../types";
import { resolveInvitation } from "../lib/resolve-invitation";
import { Grain } from "./ambient";
import { Countdown } from "./countdown";
import { Ornament } from "./ornament";
import { PhotoFrame } from "./photo-frame";
import { RsvpForm } from "./rsvp-form";

/** The reveal easing the design is timed against (README "Motion"). */
const REVEAL_EASE = [0.2, 0.7, 0.2, 1] as const;
/** The weighted open-transition easings, kept from the reference. */
const COVER_EASE = [0.7, 0, 0.2, 1] as const;
const STORY_EASE = [0.2, 0, 0, 1] as const;

/**
 * The `aurelia` layout — "الوهج الذهبي", the kinetic modern one. Unlike the other
 * layouts it is a *single unit*: a dark, glowing portal cover that, on a tap,
 * zooms and dissolves — `scale(7)` + blur + fade — straight into the story it was
 * hiding, while that story eases from `scale(1.05)` down to rest. A gold light
 * sweeps once across the screen on the way through.
 *
 * The story beneath scrolls in its own column (not the document), so a giant
 * monogram watermark can parallax behind the hero as you read, and each section
 * rises into place on scroll. It is still the same invitation, though: it
 * composes the shared {@link Countdown}, {@link RsvpForm}, {@link PhotoFrame},
 * and the `/i/<slug>/calendar` route, owns its own `.gt` root with `data-theme`
 * so all four palettes ride on it, and renders real invitation data (Arabic/RTL)
 * via `resolveInvitation`. Every ambient loop and the open transition itself
 * flatten under `prefers-reduced-motion`.
 */
export function AureliaTemplate({ invitation }: { invitation: InvitationData }) {
  const data = resolveInvitation(invitation);
  const reduceMotion = Boolean(useReducedMotion());

  const [opened, setOpened] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);

  // The monogram watermark drifts against the scroll — the signature parallax.
  const markY = useMotionValue(0);
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const onScroll = () => {
      markY.set(reduceMotion ? 0 : scroller.scrollTop * 0.9);
    };
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => scroller.removeEventListener("scroll", onScroll);
  }, [markY, reduceMotion]);

  function replay() {
    setOpened(false);
    const scroller = scrollerRef.current;
    if (scroller) scroller.scrollTop = 0;
  }

  const coverDur = reduceMotion ? 0.6 : 1.7;
  const storyDur = reduceMotion ? 0.6 : 1.9;

  return (
    <div
      className="gt fixed inset-0 overflow-hidden bg-gt-paper text-gt-ink"
      data-theme={data.theme}
    >
      <Grain />

      {/* --- Story layer (underneath) --------------------------------- */}
      <motion.div
        className="absolute inset-0 z-[1]"
        style={{ transformOrigin: "50% 56%" }}
        animate={{ scale: opened ? 1 : 1.05 }}
        transition={{ duration: storyDur, ease: STORY_EASE }}
      >
        <div
          ref={scrollerRef}
          className="au-scroll absolute inset-0 overflow-y-auto overflow-x-hidden"
        >
          <StoryColumn data={data} markY={markY} reduceMotion={reduceMotion} />
        </div>
      </motion.div>

      {/* --- Replay control (only after the reveal) ------------------- */}
      {opened && (
        <motion.button
          type="button"
          onClick={replay}
          aria-label="إعادة فتح الدعوة"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.5 }}
          className="fixed end-4 top-[46px] z-[60] flex size-9 items-center justify-center rounded-full bg-black/45 text-white/90 backdrop-blur-sm transition-colors hover:bg-black/60"
        >
          <RotateCcw className="size-4" strokeWidth={1.75} />
        </motion.button>
      )}

      {/* --- Cover layer (on top) ------------------------------------- */}
      <motion.div
        className="absolute inset-0 z-[5]"
        style={{ transformOrigin: "50% 58%", pointerEvents: opened ? "none" : "auto" }}
        animate={{
          scale: opened ? 7 : 1,
          opacity: opened ? 0 : 1,
          filter: opened ? "blur(14px)" : "blur(0px)",
        }}
        transition={
          opened
            ? {
                duration: coverDur,
                ease: COVER_EASE,
                opacity: { duration: coverDur * 0.72, ease: "easeOut", delay: 0.18 },
              }
            : { duration: 0.8, ease: "easeOut" }
        }
      >
        <Cover data={data} onOpen={() => setOpened(true)} reduceMotion={reduceMotion} />
      </motion.div>

      {/* --- One-shot light sweep ------------------------------------- */}
      {opened && !reduceMotion && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-[7] w-[55%]"
          style={{
            background:
              "linear-gradient(100deg, transparent, color-mix(in srgb, var(--gt-gold-light) 85%, transparent), transparent)",
          }}
          initial={{ x: "-120%", skewX: "-18deg", opacity: 0 }}
          animate={{ x: "230%", skewX: "-18deg", opacity: [0, 0.85, 0.55, 0] }}
          transition={{ duration: 1.25, ease: "easeOut", delay: 0.12 }}
        />
      )}
    </div>
  );
}

/* --- The cover ------------------------------------------------------------- */

/**
 * Act 1 — the portal. A deep near-black ground with a gold inset frame, a
 * drifting aurora bloom, floating light particles, a shimmering monogram, and a
 * rotating-ring button that opens the whole thing. The ground stays dark whatever
 * the theme (as in the design), but every gold reads the active palette.
 */
function Cover({
  data,
  onOpen,
  reduceMotion,
}: {
  data: ResolvedInvitation;
  onOpen: () => void;
  reduceMotion: boolean;
}) {
  const brideInitial = firstGrapheme(data.brideName);
  const groomInitial = firstGrapheme(data.groomName);

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{
        background:
          "radial-gradient(125% 90% at 50% 8%, #26221d 0%, #171513 58%, #100e0c 100%)",
      }}
    >
      <Aurora reduceMotion={reduceMotion} />
      <Particles reduceMotion={reduceMotion} />

      {/* gold inset frame */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-[20px] border"
        style={{ borderColor: "color-mix(in srgb, var(--gt-gold) 34%, transparent)" }}
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center px-11 text-center">
        <p
          className="text-[9.5px] uppercase"
          style={{
            letterSpacing: "0.42em",
            color: "color-mix(in srgb, #f1e7d6 62%, transparent)",
          }}
        >
          بخالص المحبّة، ندعوكم
        </p>

        <ShimmerText
          reduceMotion={reduceMotion}
          bright
          className="my-6 font-heading text-[clamp(58px,20vw,80px)] font-semibold leading-[0.82]"
        >
          {brideInitial}
          <span className="mx-1.5 inline-block align-middle text-[0.58em] italic">
            &amp;
          </span>
          {groomInitial}
        </ShimmerText>

        {/* diamond divider */}
        <span aria-hidden="true" className="mb-9 flex items-center gap-3">
          <span
            className="h-px w-11"
            style={{ background: "color-mix(in srgb, var(--gt-gold) 70%, transparent)" }}
          />
          <span
            className="size-1.5 rotate-45"
            style={{ background: "var(--gt-gold-light)" }}
          />
          <span
            className="h-px w-11"
            style={{ background: "color-mix(in srgb, var(--gt-gold) 70%, transparent)" }}
          />
        </span>

        <PortalButton onOpen={onOpen} reduceMotion={reduceMotion} />

        <p
          className="mt-7 text-[9px] uppercase"
          style={{ letterSpacing: "0.36em", color: "var(--gt-gold-light)" }}
        >
          افتحوا الدعوة
        </p>
        <motion.p
          aria-hidden="true"
          className="mt-3 text-[8.5px] uppercase"
          style={{
            letterSpacing: "0.28em",
            color: "color-mix(in srgb, #f1e7d6 55%, transparent)",
          }}
          animate={reduceMotion ? undefined : { opacity: [0.45, 1, 0.45] }}
          transition={
            reduceMotion
              ? undefined
              : { duration: 2, ease: "easeInOut", repeat: Infinity }
          }
        >
          المسوا للدخول
        </motion.p>
      </div>
    </div>
  );
}

/** The rotating-ring portal button: a spinning conic gold ring, a pulsing glow
 * behind it, and a dark bezel disc with an italic ampersand at its heart. */
function PortalButton({
  onOpen,
  reduceMotion,
}: {
  onOpen: () => void;
  reduceMotion: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="افتح الدعوة"
      className="relative flex size-[118px] items-center justify-center"
    >
      {/* pulsing radial glow */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute rounded-full"
        style={{
          inset: -14,
          background:
            "radial-gradient(closest-side, color-mix(in srgb, var(--gt-gold) 45%, transparent), transparent 70%)",
        }}
        animate={reduceMotion ? undefined : { opacity: [0.5, 0.9, 0.5], scale: [1, 1.12, 1] }}
        transition={
          reduceMotion
            ? undefined
            : { duration: 3.4, ease: "easeInOut", repeat: Infinity }
        }
      />

      {/* spinning masked conic ring */}
      <motion.span
        aria-hidden="true"
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0deg, var(--gt-gold-light) 70deg, transparent 150deg, transparent 210deg, var(--gt-gold) 280deg, transparent 340deg)",
          WebkitMask:
            "radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 2px))",
          mask: "radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 2px))",
        }}
        animate={reduceMotion ? undefined : { rotate: 360 }}
        transition={
          reduceMotion ? undefined : { duration: 6, ease: "linear", repeat: Infinity }
        }
      />

      {/* dark bezel disc */}
      <span
        className="relative flex size-[92px] items-center justify-center rounded-full"
        style={{
          background: "radial-gradient(circle at 40% 34%, #241f19, #141110)",
          border: "1px solid color-mix(in srgb, var(--gt-gold) 55%, transparent)",
          boxShadow:
            "inset 0 1px 2px rgba(255,255,255,.12), 0 10px 26px rgba(0,0,0,.5)",
        }}
      >
        <span
          className="font-serif text-[40px] italic"
          style={{ color: "var(--gt-gold-light)" }}
        >
          &amp;
        </span>
      </span>
    </button>
  );
}

/** The aurora bloom drifting behind the portal. */
function Aurora({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute"
      style={{
        top: "-10%",
        left: "-15%",
        width: "130%",
        height: "70%",
        borderRadius: "50%",
        background:
          "radial-gradient(closest-side, color-mix(in srgb, var(--gt-gold) 60%, transparent), transparent 72%)",
        filter: "blur(46px)",
      }}
      animate={
        reduceMotion
          ? { opacity: 0.24 }
          : {
              x: ["-8%", "8%", "-8%"],
              y: ["0%", "4%", "0%"],
              scale: [1, 1.15, 1],
              opacity: [0.22, 0.34, 0.22],
            }
      }
      transition={
        reduceMotion ? undefined : { duration: 15, ease: "easeInOut", repeat: Infinity }
      }
    />
  );
}

/** Hand-placed so the drift never clumps and never changes between server and
 * client — px sizes, second-based durations/delays, matching the reference. */
const PARTICLES = [
  { left: "18%", bottom: "20%", size: 3, duration: 9, delay: 0 },
  { left: "32%", bottom: "12%", size: 2, duration: 11, delay: 1.4 },
  { left: "52%", bottom: "24%", size: 2, duration: 10, delay: 2.6 },
  { left: "68%", bottom: "14%", size: 3, duration: 12, delay: 0.8 },
  { left: "80%", bottom: "26%", size: 2, duration: 9.5, delay: 3.2 },
  { left: "44%", bottom: "8%", size: 2, duration: 13, delay: 1.9 },
] as const;

/** Six gold light particles floating slowly upward across the cover. */
function Particles({ reduceMotion }: { reduceMotion: boolean }) {
  if (reduceMotion) return null;
  return (
    <>
      {PARTICLES.map((p) => (
        <motion.span
          key={p.left + p.bottom}
          aria-hidden="true"
          className="pointer-events-none absolute rounded-full"
          style={{
            left: p.left,
            bottom: p.bottom,
            width: p.size,
            height: p.size,
            background: "var(--gt-gold-light)",
          }}
          animate={{ y: [20, -120], opacity: [0, 0.9, 0.5, 0] }}
          transition={{
            duration: p.duration,
            ease: "easeInOut",
            repeat: Infinity,
            delay: p.delay,
          }}
        />
      ))}
    </>
  );
}

/* --- The story ------------------------------------------------------------- */

function StoryColumn({
  data,
  markY,
  reduceMotion,
}: {
  data: ResolvedInvitation;
  markY: MotionValue<number>;
  reduceMotion: boolean;
}) {
  const asksRsvp =
    data.rsvpEnabled && (Boolean(data.guest) || data.allowOpenRsvp);

  return (
    <div className="relative mx-auto min-h-full w-full max-w-[600px]">
      {/* the giant parallax monogram watermark behind the hero */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[110px] font-heading font-semibold leading-[0.8] text-gt-gold"
        style={{
          x: "-50%",
          y: markY,
          fontSize: "clamp(200px, 68vw, 340px)",
          opacity: 0.05,
          whiteSpace: "nowrap",
        }}
      >
        {data.monogram.replace(/\s+/g, "")}
      </motion.div>

      {/* --- Hero -------------------------------------------------------- */}
      <section className="relative z-[1] flex min-h-full flex-col items-center justify-center px-8 py-[76px] text-center">
        {data.guest?.name && (
          <p className="mb-4 text-[13px] tracking-[0.05em] text-gt-ink/60">
            إلى <span className="text-gt-gold">{data.guest.name}</span>
          </p>
        )}
        <p className="text-[10.5px] uppercase tracking-[0.34em] text-gt-gold/85">
          دعوة زفاف
        </p>

        <ShimmerText
          reduceMotion={reduceMotion}
          className="mt-5 font-heading text-[clamp(46px,15vw,60px)] font-semibold leading-[0.9]"
        >
          {data.brideName}
          <span className="my-1 block text-[0.56em] italic">&amp;</span>
          {data.groomName}
        </ShimmerText>

        <Ornament className="my-7" />

        {data.couplePhotoUrl && (
          <PhotoFrame
            src={data.couplePhotoUrl}
            alt={`${data.brideName} و${data.groomName}`}
            placeholder="صورة العروسين"
            wellClassName="aspect-[3/4]"
            corners
            className="mx-auto w-[min(60vw,190px)]"
          />
        )}

        <p className="mt-7 text-[clamp(14px,4vw,17px)] [word-spacing:0.16em] text-gt-ink/70">
          {data.dateDisplay}
        </p>

        {data.message && (
          <p className="mx-auto mt-5 max-w-[40ch] text-[14px] font-light leading-[1.9] text-gt-ink/60">
            {data.message}
          </p>
        )}

        <ScrollCue reduceMotion={reduceMotion} />
      </section>

      {/* --- Our story --------------------------------------------------- */}
      {data.story && (
        <AuSection title="قصتنا">
          <div className="relative mx-auto max-w-[300px] ps-7 text-start">
            <span
              aria-hidden="true"
              className="absolute inset-y-1.5 start-1 w-px bg-gt-gold/25"
            />
            <span
              aria-hidden="true"
              className="absolute start-[-1px] top-1.5 size-[9px] rotate-45 border border-gt-gold bg-gt-paper"
            />
            <p className="text-[15px] font-light leading-[1.9] text-gt-ink/75 [text-align:justify]">
              {data.story}
            </p>
          </div>
        </AuSection>
      )}

      {/* --- Save the date + countdown ---------------------------------- */}
      <AuSection title="موعد الفرح" surface>
        <div className="flex flex-wrap items-baseline justify-center gap-x-4 gap-y-1">
          <span className="text-[clamp(34px,10vw,54px)] font-light leading-none tabular-nums text-gt-ink">
            {data.dateDayMonth}
          </span>
          <span className="font-serif text-[clamp(18px,5vw,26px)] italic text-gt-gold">
            {data.dateYear}
          </span>
        </div>
        {data.dateDetail && (
          <p className="mt-3 text-[11px] uppercase tracking-[0.24em] text-gt-ink/60">
            {data.dateDetail}
          </p>
        )}
        <div className="mt-8 grid place-items-center">
          <Countdown targetISO={data.dateISO} />
        </div>
      </AuSection>

      {/* --- Ceremony ---------------------------------------------------- */}
      <AuSection title="مراسم الحفل">
        <Ornament className="mb-6" />
        <p className="font-serif text-[clamp(22px,6vw,28px)] italic text-gt-gold">
          {data.venueName}
        </p>
        <p className="mt-2 text-[10.5px] uppercase tracking-[0.2em] text-gt-ink/65">
          {data.city}
        </p>

        {data.schedule.length > 0 && (
          <ul className="mx-auto mt-8 flex max-w-[420px] flex-col gap-3.5">
            {data.schedule.map((item, index) => (
              <li
                key={`${item.time}-${index}`}
                className="flex items-center justify-between gap-4 border-b border-gt-gold/15 pb-3.5 last:border-0 last:pb-0"
              >
                <span className="text-[15px] text-gt-ink/80">{item.title}</span>
                <span className="font-serif text-[17px] text-gt-gold">
                  {item.time}
                </span>
              </li>
            ))}
          </ul>
        )}
      </AuSection>

      {/* --- Venue ------------------------------------------------------- */}
      <AuSection title="المكان">
        <PhotoFrame
          src={data.venuePhotoUrl}
          alt={data.venueName}
          placeholder="صورة المكان"
          wellClassName="aspect-[16/10]"
          matteClassName="p-[8px]"
          className="mx-auto mb-7 w-full max-w-[440px]"
        />
        <p className="text-[14px] font-light leading-[1.7] text-gt-ink/70">
          {data.venueAddress}
        </p>
        <div className="mt-6 flex justify-center">
          <AuButton href={data.mapUrl} external>
            الاتجاهات
            <ArrowLeft className="size-4" strokeWidth={1.5} />
          </AuButton>
        </div>
      </AuSection>

      {/* --- Dress code -------------------------------------------------- */}
      {data.dressCode && (
        <AuSection title="قواعد اللباس" surface>
          <p className="mx-auto max-w-[40ch] text-[clamp(16px,4.5vw,20px)] font-light leading-[1.7] text-gt-ink/80">
            {data.dressCode}
          </p>
          <div className="mt-7 flex justify-center gap-3.5">
            {DRESS_DOTS.map((colour, i) => (
              <span
                key={i}
                aria-hidden="true"
                className="size-[26px] rounded-full border border-gt-gold/25"
                style={{ background: colour }}
              />
            ))}
          </div>
        </AuSection>
      )}

      {/* --- Actions ----------------------------------------------------- */}
      <AuReveal className="w-full px-8 py-8">
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {asksRsvp && (
            <AuButton href="#rsvp" primary>
              تأكيد الحضور
              <MailCheck className="size-4" strokeWidth={1.5} />
            </AuButton>
          )}
          <AuButton href={`/i/${data.slug}/calendar`}>
            أضف إلى التقويم
            <CalendarPlus className="size-4" strokeWidth={1.5} />
          </AuButton>
        </div>
      </AuReveal>

      {/* --- RSVP -------------------------------------------------------- */}
      {asksRsvp && (
        <AuSection id="rsvp" title="تأكيد الحضور">
          <div className="mx-auto w-full max-w-[440px] text-start">
            <RsvpForm
              slug={data.slug}
              guest={data.guest}
              maxPartySize={data.maxPartySize}
              open={data.rsvpOpen}
              allowOpenRsvp={data.allowOpenRsvp}
            />
          </div>
        </AuSection>
      )}

      {/* --- Footer ------------------------------------------------------ */}
      <footer className="flex flex-col items-center gap-3 border-t border-gt-gold/15 px-8 py-11 text-center">
        <span className="font-serif text-[26px] italic text-gt-gold/90">
          {data.monogram}
        </span>
        {data.hashtag && (
          <span className="text-[13px] tracking-[0.04em] text-gt-ink/55">
            {data.hashtag}
          </span>
        )}
        {data.rsvpPhone && (
          <a
            href={`tel:${data.rsvpPhone.replace(/[^\d+]/g, "")}`}
            dir="ltr"
            className="text-[13px] text-gt-ink/55 transition-colors hover:text-gt-gold"
          >
            {data.rsvpPhone}
          </a>
        )}
      </footer>
    </div>
  );
}

/** The dress-code palette dots — dusk-and-gold, drawn from the active theme. */
const DRESS_DOTS = [
  "var(--gt-paper)",
  "color-mix(in srgb, var(--gt-gold) 45%, var(--gt-ink))",
  "var(--gt-gold)",
  "var(--gt-ink)",
  "var(--gt-gold-deep)",
] as const;

/* --- Furniture ------------------------------------------------------------- */

/**
 * A titled story section that rises into view on scroll. `surface` tints the
 * band, alternating the reading rhythm the way the reference does.
 */
function AuSection({
  title,
  id,
  surface,
  children,
}: {
  title: string;
  id?: string;
  surface?: boolean;
  children: ReactNode;
}) {
  return (
    <AuReveal
      className={`w-full scroll-mt-6 border-t border-gt-gold/10 px-8 py-[clamp(48px,12vw,72px)] text-center ${
        surface ? "bg-gt-gold/[0.04]" : ""
      }`}
    >
      <section id={id} className="w-full">
        <h2 className="mb-6 text-[10.5px] uppercase tracking-[0.34em] text-gt-gold/80">
          {title}
        </h2>
        {children}
      </section>
    </AuReveal>
  );
}

/** Rises its children from `opacity:0; y:26` the first time they scroll in. */
function AuReveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.9, ease: REVEAL_EASE }}
    >
      {children}
    </motion.div>
  );
}

/** The "scroll on" cue at the foot of the hero, breathing down the page. */
function ScrollCue({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <motion.div
      aria-hidden="true"
      className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1.5 text-gt-gold"
      animate={reduceMotion ? undefined : { y: [0, 7, 0], opacity: [0.5, 1, 0.5] }}
      transition={
        reduceMotion
          ? undefined
          : { duration: 1.9, ease: "easeInOut", repeat: Infinity }
      }
    >
      <span className="text-[8.5px] uppercase tracking-[0.3em] text-gt-ink/55">
        تابعوا
      </span>
      <ChevronDown className="size-4" strokeWidth={1.5} />
    </motion.div>
  );
}

/**
 * A gold-gradient headline that shimmers as its background sweeps across. The
 * `bright` variant carries a white highlight for reading on the dark cover;
 * both derive from the active palette. Static under reduced motion.
 */
function ShimmerText({
  children,
  className,
  bright,
  reduceMotion,
}: {
  children: ReactNode;
  className?: string;
  bright?: boolean;
  reduceMotion: boolean;
}) {
  const gradient = bright
    ? "linear-gradient(100deg, var(--gt-gold-deep) 0%, var(--gt-gold-light) 26%, #fff2d6 50%, var(--gt-gold-light) 74%, var(--gt-gold-deep) 100%)"
    : "linear-gradient(100deg, var(--gt-gold-deep) 0%, var(--gt-gold) 28%, var(--gt-gold-light) 50%, var(--gt-gold) 72%, var(--gt-gold-deep) 100%)";

  return (
    <motion.h1
      className={className}
      style={{
        backgroundImage: gradient,
        backgroundSize: "220% 100%",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
        color: "transparent",
      }}
      animate={reduceMotion ? undefined : { backgroundPositionX: ["0%", "-220%"] }}
      transition={
        reduceMotion
          ? undefined
          : { duration: 7, ease: "easeInOut", repeat: Infinity }
      }
    >
      {children}
    </motion.h1>
  );
}

/** The layout's pill actions — a filled gold gradient primary, glassy outlines
 * otherwise; matches the `gem` register this modern layout belongs to. */
function AuButton({
  href,
  children,
  external,
  primary,
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
  primary?: boolean;
}) {
  const rel = external ? { target: "_blank", rel: "noopener noreferrer" } : {};
  if (primary) {
    return (
      <a
        href={href}
        {...rel}
        className="flex items-center gap-2.5 rounded-full border border-gt-gold/50 px-[26px] py-[13px] text-sm font-medium [word-spacing:0.06em] text-gt-paper shadow-[0_10px_30px_-12px_var(--gt-gold-deep)] transition-transform duration-300 hover:scale-[1.03]"
        style={{
          background:
            "linear-gradient(135deg, var(--gt-gold-light), var(--gt-gold-deep))",
        }}
      >
        {children}
      </a>
    );
  }
  return (
    <a
      href={href}
      {...rel}
      className="flex items-center gap-2.5 rounded-full border border-gt-gold/40 bg-gt-paper/30 px-[24px] py-[12px] text-sm [word-spacing:0.06em] text-gt-gold-btn backdrop-blur-md transition-colors duration-400 hover:border-gt-gold/75 hover:bg-gt-gold/10"
    >
      {children}
    </a>
  );
}

/** First grapheme of a name — the initials on the cover monogram. */
function firstGrapheme(name: string): string {
  return Array.from(name.trim())[0] ?? "";
}
