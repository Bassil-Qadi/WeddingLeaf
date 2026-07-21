"use client";

import { ArrowLeft, CalendarPlus, MailCheck } from "lucide-react";

import type { ResolvedInvitation } from "../types";
import { Countdown } from "./countdown";
import { Ornament } from "./ornament";
import { PhotoFrame } from "./photo-frame";
import { Reveal } from "./reveal";
import { RsvpForm } from "./rsvp-form";

/**
 * Act 2 — the story the cover opens onto. One continuous vertical scroll shared
 * by all three "royal" treatments (envelope / doors / veil): hero → our story →
 * save-the-date → ceremony → venue → dress code → RSVP → footer.
 *
 * It renders nothing new of its own — every feature is a shared piece it merely
 * arranges: {@link Countdown}, the {@link RsvpForm}, the `/i/<slug>/calendar`
 * route, and the `mapUrl` for directions. Content is real invitation data via
 * `resolveInvitation` (Arabic/RTL), not the design mock's English copy. Colour
 * reads the theme variables, so all four palettes ride on it.
 */
export function InviteStory({ data }: { data: ResolvedInvitation }) {
  const asksRsvp =
    data.rsvpEnabled && (Boolean(data.guest) || data.allowOpenRsvp);

  return (
    <main className="relative z-[1] w-full">
      {/* --- Hero -------------------------------------------------------- */}
      <header className="mx-auto flex min-h-screen max-w-[640px] flex-col items-center justify-center gap-8 px-6 py-24 text-center">
        <Reveal className="w-full" duration={1.2}>
          {data.couplePhotoUrl && (
            <PhotoFrame
              src={data.couplePhotoUrl}
              alt={`${data.brideName} و${data.groomName}`}
              placeholder="صورة العروسين"
              wellClassName="aspect-[3/4]"
              corners
              className="mx-auto mb-9 w-[min(72vw,280px)]"
            />
          )}

          {data.guest?.name ? (
            <p className="mb-4 text-[13px] tracking-[0.05em] text-gt-ink/60">
              إلى <span className="text-gt-gold">{data.guest.name}</span>
            </p>
          ) : (
            <p className="mb-4 text-[12px] uppercase tracking-[0.4em] text-gt-gold/85">
              دعوة زفاف
            </p>
          )}

          <p className="text-[13px] tracking-[0.06em] text-gt-ink/55">
            بخالص الفرح، يتشرّفان بدعوتكم
          </p>

          <h1 className="mt-4 font-heading text-[clamp(40px,12vw,68px)] leading-[1.18] text-gt-ink">
            {data.brideName}
            <span className="mx-3 font-serif italic text-gt-gold">&amp;</span>
            {data.groomName}
          </h1>

          <Ornament className="my-7" />

          <p className="text-[clamp(15px,4vw,18px)] [word-spacing:0.16em] text-gt-ink/70">
            {data.dateDisplay}
          </p>

          {data.message && (
            <p className="mx-auto mt-6 max-w-[42ch] text-[15px] font-light leading-[1.9] text-gt-ink/65">
              {data.message}
            </p>
          )}
        </Reveal>
      </header>

      <div className="mx-auto flex max-w-[600px] flex-col gap-[clamp(56px,13vw,104px)] px-5 pb-[clamp(56px,13vw,104px)]">
        {/* --- Our story ------------------------------------------------- */}
        {data.story && (
          <StorySection title="قصتنا">
            <p className="mx-auto max-w-[46ch] text-[15px] font-light leading-[2] text-gt-ink/70">
              {data.story}
            </p>
          </StorySection>
        )}

        {/* --- Save the date + countdown -------------------------------- */}
        <StorySection title="موعد الفرح">
          <div className="flex flex-wrap items-baseline justify-center gap-x-4 gap-y-1">
            <span className="text-[clamp(30px,8vw,44px)] font-extralight leading-none text-gt-ink">
              {data.dateDayMonth}
            </span>
            <span className="font-serif text-[clamp(18px,5vw,26px)] italic text-gt-gold/95">
              {data.dateYear}
            </span>
          </div>
          {data.dateDetail && (
            <p className="mt-3 text-[14px] [word-spacing:0.16em] text-gt-ink/60">
              {data.dateDetail}
            </p>
          )}
          <div className="mt-8 grid place-items-center">
            <Countdown targetISO={data.dateISO} />
          </div>
        </StorySection>

        {/* --- Ceremony / programme ------------------------------------- */}
        <StorySection title="مراسم الحفل">
          <p className="text-[clamp(18px,5vw,22px)] text-gt-ink">
            {data.venueName}
          </p>
          <p className="mt-1.5 text-[14px] font-light text-gt-ink/60">
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
        </StorySection>

        {/* --- Venue band ------------------------------------------------ */}
        <StorySection title="المكان">
          <PhotoFrame
            src={data.venuePhotoUrl}
            alt={data.venueName}
            placeholder="صورة المكان"
            wellClassName="aspect-[16/10]"
            matteClassName="p-[8px]"
            className="mx-auto mb-7 w-full max-w-[460px]"
          />
          <p className="text-[14px] font-light text-gt-ink/65">
            {data.venueAddress}
          </p>
          <div className="mt-6 flex justify-center">
            <StoryButton href={data.mapUrl} external>
              الاتجاهات
              <ArrowLeft className="size-4" strokeWidth={1.5} />
            </StoryButton>
          </div>
        </StorySection>

        {/* --- Dress code ------------------------------------------------ */}
        {data.dressCode && (
          <StorySection title="قواعد اللباس">
            <p className="mx-auto max-w-[40ch] text-[15px] font-light leading-[1.9] text-gt-ink/70">
              {data.dressCode}
            </p>
            <Ornament className="mt-7" />
          </StorySection>
        )}

        {/* --- Actions --------------------------------------------------- */}
        <Reveal>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {asksRsvp && (
              <StoryButton href="#rsvp" primary>
                تأكيد الحضور
                <MailCheck className="size-4" strokeWidth={1.5} />
              </StoryButton>
            )}
            <StoryButton href={`/i/${data.slug}/calendar`}>
              أضف إلى التقويم
              <CalendarPlus className="size-4" strokeWidth={1.5} />
            </StoryButton>
          </div>
        </Reveal>

        {/* --- RSVP ------------------------------------------------------ */}
        {asksRsvp && (
          <StorySection id="rsvp" title="تأكيد الحضور">
            <div className="mx-auto w-full max-w-[440px] text-start">
              <RsvpForm
                slug={data.slug}
                guest={data.guest}
                maxPartySize={data.maxPartySize}
                open={data.rsvpOpen}
                allowOpenRsvp={data.allowOpenRsvp}
              />
            </div>
          </StorySection>
        )}

        {/* --- Footer ---------------------------------------------------- */}
        <footer className="flex flex-col items-center gap-3 pt-4 text-center">
          <span className="font-serif text-[22px] italic text-gt-gold/90">
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
    </main>
  );
}

/** A quiet titled block, matching the card/album layouts' section rhythm. */
function StorySection({
  title,
  id,
  children,
}: {
  title: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal className="w-full">
      <section id={id} className="w-full scroll-mt-24 text-center">
        <h2 className="mb-6 text-[12px] uppercase tracking-[0.32em] text-gt-gold/75">
          {title}
        </h2>
        {children}
      </section>
    </Reveal>
  );
}

/** Matches the other layouts' pill actions, so all the layouts feel like kin. */
function StoryButton({
  href,
  children,
  external,
  primary,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  primary?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`flex items-center gap-2.5 rounded-full border px-[24px] py-[12px] text-sm [word-spacing:0.06em] text-gt-gold-btn transition-colors duration-400 hover:border-gt-gold/75 hover:bg-gt-gold/10 ${
        primary ? "border-gt-gold/60 bg-gt-gold/[0.06]" : "border-gt-gold/45"
      }`}
    >
      {children}
    </a>
  );
}
