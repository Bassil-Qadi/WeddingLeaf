"use client";

import type { PointerEvent, ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowLeft, CalendarPlus, MailCheck } from "lucide-react";

import type { InvitationData, ResolvedInvitation } from "../types";
import { resolveInvitation } from "../lib/resolve-invitation";
import { Grain, Wordmark } from "./ambient";
import { Countdown } from "./countdown";
import { GemJewel } from "./gem-jewel";
import { Ornament } from "./ornament";
import { PhotoFrame } from "./photo-frame";
import { RsvpForm } from "./rsvp-form";

/** The reveal easing shared across the whole invitation family. */
const EASE = [0.7, 0, 0.15, 1] as const;

/**
 * The `gem` layout — "الجوهرة", the modern one. Where the other layouts are flat
 * and typographic, this one has depth: a hero that tilts under the pointer with
 * its elements floating at different distances, a spinning faceted {@link
 * GemJewel} at its centre, an aurora drifting behind everything, and the rest of
 * the invitation carried on frosted glass panels that rise with a slight 3D
 * tilt as they enter.
 *
 * It is still the same invitation, though — it composes the shared {@link
 * Countdown}, {@link RsvpForm}, {@link PhotoFrame}, and the `/i/<slug>/calendar`
 * route rather than rebuilding any of them, owns its own `.gt` root with
 * `data-theme` so all four palettes ride on it, and renders real invitation data
 * (Arabic/RTL) via `resolveInvitation`. Every 3D effect is pure CSS transforms +
 * framer-motion — no WebGL — and every one of them flattens under
 * `prefers-reduced-motion`.
 */
export function GemTemplate({ invitation }: { invitation: InvitationData }) {
  const data = resolveInvitation(invitation);

  const asksRsvp =
    data.rsvpEnabled && (Boolean(data.guest) || data.allowOpenRsvp);

  return (
    <div
      className="gt relative min-h-screen w-full overflow-x-hidden bg-gt-paper text-gt-ink"
      data-theme={data.theme}
    >
      <Aurora />
      <Grain />
      <Wordmark />

      <HeroStage data={data} />

      <main className="relative z-[1] mx-auto flex w-full max-w-[600px] flex-col gap-[clamp(28px,7vw,56px)] px-5 pb-[clamp(56px,13vw,104px)]">
        {data.story && (
          <TiltReveal>
            <GlassPanel title="قصتنا">
              <p className="mx-auto max-w-[46ch] text-[15px] font-light leading-[2] text-gt-ink/75">
                {data.story}
              </p>
            </GlassPanel>
          </TiltReveal>
        )}

        <TiltReveal>
          <GlassPanel title="موعد الفرح">
            <div className="flex flex-wrap items-baseline justify-center gap-x-4 gap-y-1">
              <span className="text-[clamp(30px,8vw,44px)] font-extralight leading-none text-gt-ink">
                {data.dateDayMonth}
              </span>
              <span className="font-serif text-[clamp(18px,5vw,26px)] italic text-gt-gold">
                {data.dateYear}
              </span>
            </div>
            {data.dateDetail && (
              <p className="mt-3 text-[14px] [word-spacing:0.16em] text-gt-ink/65">
                {data.dateDetail}
              </p>
            )}
            <div className="mt-8 grid place-items-center">
              <Countdown targetISO={data.dateISO} />
            </div>
          </GlassPanel>
        </TiltReveal>

        <TiltReveal>
          <GlassPanel title="مراسم الحفل">
            <p className="text-[clamp(18px,5vw,22px)] text-gt-ink">
              {data.venueName}
            </p>
            <p className="mt-1.5 text-[14px] font-light text-gt-ink/65">
              {data.city}
            </p>

            {data.schedule.length > 0 && (
              <ul className="mx-auto mt-7 flex max-w-[420px] flex-col gap-3.5">
                {data.schedule.map((item, index) => (
                  <li
                    key={`${item.time}-${index}`}
                    className="flex items-center justify-between gap-4 border-b border-gt-gold/15 pb-3.5 last:border-0 last:pb-0"
                  >
                    <span className="text-[15px] text-gt-ink/80">
                      {item.title}
                    </span>
                    <span className="font-serif text-[17px] text-gt-gold">
                      {item.time}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </GlassPanel>
        </TiltReveal>

        <TiltReveal>
          <GlassPanel title="المكان">
            <PhotoFrame
              src={data.venuePhotoUrl}
              alt={data.venueName}
              placeholder="صورة المكان"
              wellClassName="aspect-[16/10]"
              matteClassName="p-[8px]"
              className="mx-auto mb-7 w-full max-w-[440px]"
            />
            <p className="text-[14px] font-light text-gt-ink/70">
              {data.venueAddress}
            </p>
            <div className="mt-6 flex justify-center">
              <GemButton href={data.mapUrl} external>
                الاتجاهات
                <ArrowLeft className="size-4" strokeWidth={1.5} />
              </GemButton>
            </div>
          </GlassPanel>
        </TiltReveal>

        {data.dressCode && (
          <TiltReveal>
            <GlassPanel title="قواعد اللباس">
              <p className="mx-auto max-w-[40ch] text-[15px] font-light leading-[1.9] text-gt-ink/75">
                {data.dressCode}
              </p>
              <Ornament className="mt-7" />
            </GlassPanel>
          </TiltReveal>
        )}

        <TiltReveal>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {asksRsvp && (
              <GemButton href="#rsvp" primary>
                تأكيد الحضور
                <MailCheck className="size-4" strokeWidth={1.5} />
              </GemButton>
            )}
            <GemButton href={`/i/${data.slug}/calendar`}>
              أضف إلى التقويم
              <CalendarPlus className="size-4" strokeWidth={1.5} />
            </GemButton>
          </div>
        </TiltReveal>

        {asksRsvp && (
          <TiltReveal>
            <GlassPanel id="rsvp" title="تأكيد الحضور">
              <div className="mx-auto w-full max-w-[440px] text-start">
                <RsvpForm
                  slug={data.slug}
                  guest={data.guest}
                  maxPartySize={data.maxPartySize}
                  open={data.rsvpOpen}
                  allowOpenRsvp={data.allowOpenRsvp}
                />
              </div>
            </GlassPanel>
          </TiltReveal>
        )}

        <footer className="flex flex-col items-center gap-3 pt-4 text-center">
          <span className="font-serif text-[22px] italic text-gt-gold/90">
            {data.monogram}
          </span>
          {data.hashtag && (
            <span className="text-[13px] tracking-[0.04em] text-gt-ink/60">
              {data.hashtag}
            </span>
          )}
          {data.rsvpPhone && (
            <a
              href={`tel:${data.rsvpPhone.replace(/[^\d+]/g, "")}`}
              dir="ltr"
              className="text-[13px] text-gt-ink/60 transition-colors hover:text-gt-gold"
            >
              {data.rsvpPhone}
            </a>
          )}
        </footer>
      </main>
    </div>
  );
}

/* --- The hero, in three dimensions ---------------------------------------- */

/**
 * The pointer-parallax hero. The whole card tilts toward the cursor while its
 * layers — a deep faded monogram, the floating jewel, the glass name plate —
 * ride at different `translateZ` and shift by different amounts, so the scene
 * has real depth rather than a flat parallax fake. Only a mouse drives it; touch
 * is left alone so scrolling stays clean, and reduced motion holds it all still.
 */
function HeroStage({ data }: { data: ResolvedInvitation }) {
  const reduceMotion = useReducedMotion();

  // Pointer position within the stage, -0.5 … 0.5 on each axis.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 130, damping: 20 });
  const sy = useSpring(py, { stiffness: 130, damping: 20 });

  const rotateX = useTransform(sy, [-0.5, 0.5], [9, -9]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-13, 13]);
  const jewelX = useTransform(sx, [-0.5, 0.5], [34, -34]);
  const jewelY = useTransform(sy, [-0.5, 0.5], [26, -26]);
  const backX = useTransform(sx, [-0.5, 0.5], [-26, 26]);
  const backY = useTransform(sy, [-0.5, 0.5], [-20, 20]);

  function handleMove(e: PointerEvent<HTMLElement>) {
    if (reduceMotion || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleLeave() {
    px.set(0);
    py.set(0);
  }

  return (
    <section
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className="relative z-[1] flex min-h-screen w-full items-center justify-center px-6 py-24"
      style={{ perspective: 1100 }}
    >
      <motion.div
        className="relative flex w-full max-w-[560px] flex-col items-center text-center"
        style={{
          transformStyle: "preserve-3d",
          rotateX: reduceMotion ? 0 : rotateX,
          rotateY: reduceMotion ? 0 : rotateY,
        }}
      >
        {/* deepest layer — a giant faded monogram set behind the jewel */}
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute -top-[6%] left-1/2 -translate-x-1/2 font-serif italic leading-none text-gt-gold/[0.07]"
          style={{
            fontSize: "clamp(180px, 52vw, 320px)",
            x: reduceMotion ? 0 : backX,
            y: reduceMotion ? 0 : backY,
            z: -70,
          }}
        >
          {data.monogram.replace(/\s+/g, "")}
        </motion.span>

        {/* the jewel, floating nearest the viewer */}
        <motion.div
          className="mb-9"
          style={{
            x: reduceMotion ? 0 : jewelX,
            y: reduceMotion ? 0 : jewelY,
            z: 56,
          }}
        >
          <GemJewel />
        </motion.div>

        {/* the name plate — frosted glass lifted just off the page */}
        <div
          className="relative w-full max-w-[440px] rounded-[28px] border border-gt-gold/25 bg-gt-paper/35 px-[clamp(24px,7vw,48px)] py-[clamp(28px,7vw,44px)] shadow-[0_30px_80px_-40px_var(--gt-gold-deep)] backdrop-blur-xl"
          style={{ transform: "translateZ(34px)" }}
        >
          <PanelSheen />

          {data.guest?.name ? (
            <p className="mb-4 text-[13px] tracking-[0.05em] text-gt-ink/65">
              إلى <span className="text-gt-gold">{data.guest.name}</span>
            </p>
          ) : (
            <p className="mb-4 text-[12px] uppercase tracking-[0.4em] text-gt-gold/85">
              دعوة زفاف
            </p>
          )}

          <p className="text-[13px] tracking-[0.06em] text-gt-ink/60">
            بخالص الفرح، يتشرّفان بدعوتكم
          </p>

          <h1 className="mt-3 font-heading text-[clamp(38px,11vw,60px)] leading-[1.18] text-gt-ink">
            {data.brideName}
            <span className="mx-3 font-serif italic text-gt-gold">&amp;</span>
            {data.groomName}
          </h1>

          <Ornament className="my-6" />

          <p className="text-[clamp(15px,4vw,18px)] [word-spacing:0.16em] text-gt-ink/70">
            {data.dateDisplay}
          </p>

          {data.message && (
            <p className="mx-auto mt-5 max-w-[38ch] text-[14px] font-light leading-[1.9] text-gt-ink/65">
              {data.message}
            </p>
          )}
        </div>
      </motion.div>

      <ScrollCue reduceMotion={Boolean(reduceMotion)} />
    </section>
  );
}

/* --- Ambient & furniture --------------------------------------------------- */

/**
 * A slow aurora of gold light drifting behind the whole page — three big blurred
 * blooms breathing in and out of one another. Fixed and non-interactive; it sets
 * the "jewel in a lit case" mood the layout is built on. Held still under
 * reduced motion.
 */
function Aurora() {
  const reduceMotion = useReducedMotion();

  const blooms = [
    {
      className: "left-[-15%] top-[-10%] size-[70vw]",
      colour: "var(--gt-gold-light)",
      drift: { x: [0, 40, 0], y: [0, 30, 0] },
      duration: 20,
    },
    {
      className: "right-[-20%] top-[20%] size-[65vw]",
      colour: "var(--gt-gold)",
      drift: { x: [0, -34, 0], y: [0, 44, 0] },
      duration: 26,
    },
    {
      className: "bottom-[-15%] left-[10%] size-[60vw]",
      colour: "var(--gt-gold-deep)",
      drift: { x: [0, 30, 0], y: [0, -28, 0] },
      duration: 23,
    },
  ];

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {blooms.map((bloom, i) => (
        <motion.span
          key={i}
          className={`absolute rounded-full ${bloom.className}`}
          style={{
            background: `radial-gradient(circle, color-mix(in srgb, ${bloom.colour} 26%, transparent), transparent 66%)`,
            filter: "blur(60px)",
          }}
          animate={reduceMotion ? undefined : bloom.drift}
          transition={
            reduceMotion
              ? undefined
              : {
                  duration: bloom.duration,
                  ease: "easeInOut",
                  repeat: Infinity,
                }
          }
        />
      ))}
    </div>
  );
}

/** A frosted-glass card carrying one section of the invitation. */
function GlassPanel({
  title,
  id,
  children,
}: {
  title: string;
  id?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="relative w-full scroll-mt-24 overflow-hidden rounded-[24px] border border-gt-gold/20 bg-gt-paper/35 px-[clamp(22px,6vw,44px)] py-[clamp(32px,8vw,52px)] text-center shadow-[0_26px_70px_-40px_var(--gt-gold-deep)] backdrop-blur-xl"
    >
      <PanelSheen />
      <h2 className="mb-6 text-[12px] uppercase tracking-[0.32em] text-gt-gold/80">
        {title}
      </h2>
      {children}
    </section>
  );
}

/** The hairline + top gradient that reads a translucent panel as glass. */
function PanelSheen() {
  return (
    <>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{
          background:
            "linear-gradient(150deg, rgba(255,255,255,.14), transparent 42%)",
        }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-[6px] rounded-[inherit] border border-gt-gold/12"
      />
    </>
  );
}

/**
 * Rises its children into place with a slight forward tilt as they enter — the
 * flat `Reveal`'s 3D cousin, for the layout that lives in depth. Under reduced
 * motion the content is simply there.
 */
function TiltReveal({
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
      initial={{ opacity: 0, y: 48, rotateX: 12 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, amount: 0.25, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.9, ease: EASE }}
      style={{ transformPerspective: 900 }}
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
      className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
      animate={reduceMotion ? undefined : { y: [0, 8, 0], opacity: [0.5, 1, 0.5] }}
      transition={
        reduceMotion
          ? undefined
          : { duration: 2.2, ease: "easeInOut", repeat: Infinity }
      }
    >
      <span className="text-[10px] uppercase tracking-[0.3em] text-gt-gold/70">
        تابعوا
      </span>
      <span className="h-8 w-px bg-gradient-to-b from-gt-gold/70 to-transparent" />
    </motion.div>
  );
}

/**
 * The layout's pill actions. The primary one is filled with a gold gradient — a
 * touch more modern than the outlined pills of the other layouts, matching this
 * one's register — while the rest stay as glassy outlines.
 */
function GemButton({
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
  if (primary) {
    return (
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
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
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="flex items-center gap-2.5 rounded-full border border-gt-gold/40 bg-gt-paper/30 px-[24px] py-[12px] text-sm [word-spacing:0.06em] text-gt-gold-btn backdrop-blur-md transition-colors duration-400 hover:border-gt-gold/75 hover:bg-gt-gold/10"
    >
      {children}
    </a>
  );
}
