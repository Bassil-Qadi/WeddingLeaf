"use client";

import Image from "next/image";
import { ArrowLeft, CalendarPlus, MailCheck } from "lucide-react";

import { cloudinaryLoader } from "@/lib/cloudinary-loader";
import type { InvitationData } from "../types";
import { resolveInvitation } from "../lib/resolve-invitation";
import { toArabicDigits } from "../lib/arabic";
import { Grain, Wordmark } from "./ambient";
import { Countdown } from "./countdown";
import { Ornament } from "./ornament";
import { Reveal } from "./reveal";
import { RsvpForm } from "./rsvp-form";

/**
 * The `card` layout — a single formal panel rather than the thread's cinematic
 * scroll. Everything the guest needs sits on one screen: the names, the date,
 * the place, and a row of actions (RSVP, directions, calendar). Optional detail
 * — the countdown, the couple's story, the programme, the RSVP form — follows
 * quietly below for anyone who scrolls.
 *
 * It owns its own `.gt` root with `data-theme`, so any palette rides on it, and
 * it composes the shared {@link RsvpForm} and the `/i/<slug>/calendar` route, so
 * no feature is rebuilt here — only rearranged.
 */
export function CardTemplate({ invitation }: { invitation: InvitationData }) {
  const data = resolveInvitation(invitation);

  const asksRsvp =
    data.rsvpEnabled && (Boolean(data.guest) || data.allowOpenRsvp);
  const tellsStory = Boolean(data.story);

  return (
    <div
      className="gt relative min-h-screen w-full overflow-x-hidden bg-gt-paper text-gt-ink"
      data-theme={data.theme}
    >
      <Grain />
      <Wordmark />

      <main className="relative z-[1] mx-auto flex min-h-screen max-w-[600px] flex-col items-center justify-center gap-10 px-5 py-24">
        <Reveal className="w-full" duration={1.1}>
          <article className="relative w-full overflow-hidden rounded-[3px] border border-gt-gold/40 bg-gt-paper/40 px-[clamp(24px,7vw,52px)] py-[clamp(40px,9vw,64px)] text-center shadow-[0_20px_60px_-30px] shadow-gt-gold-deep/30">
            {/* The inner hairline that reads a bordered panel as a printed card. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-[7px] rounded-[2px] border border-gt-gold/15"
            />

            {data.couplePhotoUrl && (
              <div className="mx-auto mb-8 size-28 overflow-hidden rounded-full border border-gt-gold/40 p-1">
                <Image
                  src={data.couplePhotoUrl}
                  alt={`${data.brideName} و${data.groomName}`}
                  width={112}
                  height={112}
                  sizes="112px"
                  className="size-full rounded-full object-cover"
                  loader={cloudinaryLoader}
                />
              </div>
            )}

            {data.guest?.name ? (
              <p className="mb-5 text-[13px] tracking-[0.05em] text-gt-ink/55">
                إلى <span className="text-gt-gold">{data.guest.name}</span>
              </p>
            ) : (
              <p className="mb-5 text-[12px] uppercase tracking-[0.4em] text-gt-gold/80">
                دعوة زفاف
              </p>
            )}

            <p className="text-[13px] tracking-[0.06em] text-gt-ink/55">
              بخالص الفرح، يتشرّفان بدعوتكم
            </p>

            <h1 className="mt-4 font-heading text-[clamp(34px,10vw,56px)] leading-[1.25] text-gt-ink">
              {data.brideName}
              <span className="mx-3 font-serif italic text-gt-gold">&amp;</span>
              {data.groomName}
            </h1>

            {data.message && (
              <p className="mx-auto mt-4 max-w-[42ch] text-[15px] font-light leading-[1.9] text-gt-ink/65">
                {data.message}
              </p>
            )}

            <Ornament className="my-8" />

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

            <Ornament className="my-8" />

            <p className="text-[clamp(18px,5vw,22px)] text-gt-ink">
              {data.venueName}
            </p>
            <p className="mt-1.5 text-[14px] font-light text-gt-ink/60">
              {data.venueAddress}
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-2.5">
              {asksRsvp && (
                <CardButton href="#rsvp" primary>
                  تأكيد الحضور
                  <MailCheck className="size-4" strokeWidth={1.5} />
                </CardButton>
              )}
              <CardButton href={data.mapUrl} external>
                الاتجاهات
                <ArrowLeft className="size-4" strokeWidth={1.5} />
              </CardButton>
              <CardButton href={`/i/${data.slug}/calendar`}>
                أضف إلى التقويم
                <CalendarPlus className="size-4" strokeWidth={1.5} />
              </CardButton>
            </div>
          </article>
        </Reveal>

        {tellsStory && (
          <CardSection title="قصتنا">
            <p className="mx-auto max-w-[46ch] text-[15px] font-light leading-[2] text-gt-ink/70">
              {data.story}
            </p>
          </CardSection>
        )}

        {data.schedule.length > 0 && (
          <CardSection title="برنامج الحفل">
            <ul className="mx-auto flex max-w-[420px] flex-col gap-3.5">
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
          </CardSection>
        )}

        {asksRsvp && (
          <CardSection id="rsvp" title="تأكيد الحضور">
            <div className="mx-auto w-full max-w-[440px] text-start">
              <RsvpForm
                slug={data.slug}
                guest={data.guest}
                maxPartySize={data.maxPartySize}
                open={data.rsvpOpen}
                allowOpenRsvp={data.allowOpenRsvp}
              />
            </div>
          </CardSection>
        )}

        <footer className="flex flex-col items-center gap-3 text-center">
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
      </main>
    </div>
  );
}

/** A pill action matching the thread layout's buttons, so the two feel kin. */
function CardButton({
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
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      className={`flex items-center gap-2.5 rounded-full border px-[24px] py-[12px] text-sm [word-spacing:0.06em] text-gt-gold-btn transition-colors duration-400 hover:border-gt-gold/75 hover:bg-gt-gold/10 ${
        primary
          ? "border-gt-gold/60 bg-gt-gold/[0.06]"
          : "border-gt-gold/45"
      }`}
    >
      {children}
    </a>
  );
}

/** A quiet titled block for the optional detail that follows the card. */
function CardSection({
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
