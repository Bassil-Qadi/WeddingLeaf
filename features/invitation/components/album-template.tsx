"use client";

import Image from "next/image";
import { ArrowLeft, CalendarPlus, MailCheck } from "lucide-react";

import type { InvitationData } from "../types";
import { resolveInvitation } from "../lib/resolve-invitation";
import { Grain, Wordmark } from "./ambient";
import { Countdown } from "./countdown";
import { Ornament } from "./ornament";
import { Reveal } from "./reveal";
import { RsvpForm } from "./rsvp-form";

/**
 * The `album` layout — the couple's photographs carry the invitation and the
 * words caption them, the inverse of `card`. A full-bleed cover opens it, then
 * bands alternate image and text down the page, then a grid holds whatever
 * images are left over.
 *
 * It degrades on purpose. A couple can pick this layout before uploading a
 * single photo, so every image slot falls back to an ornamented type band
 * rather than a hole — the page stays a complete invitation, just a quieter
 * one, and fills in as they upload.
 *
 * Like the other layouts it owns its own `.gt` root with `data-theme` (so all
 * four palettes ride on it) and composes the shared {@link RsvpForm} and the
 * `/i/<slug>/calendar` route rather than reimplementing either.
 */
export function AlbumTemplate({ invitation }: { invitation: InvitationData }) {
  const data = resolveInvitation(invitation);

  const asksRsvp =
    data.rsvpEnabled && (Boolean(data.guest) || data.allowOpenRsvp);

  // The cover is spent on the hero and the next two on the story and venue
  // bands; only what survives that goes to the grid, so no photo repeats.
  const cover = data.coverImageUrl ?? data.galleryImages[0];
  const bandImages = data.galleryImages.filter((url) => url !== cover);
  const storyImage = bandImages[0];
  const venueImage = bandImages[1];
  const gridImages = bandImages.slice(2);

  return (
    <div
      className="gt relative min-h-screen w-full overflow-x-hidden bg-gt-paper text-gt-ink"
      data-theme={data.theme}
    >
      <Grain />
      <Wordmark />

      {/* --- Cover ------------------------------------------------------- */}
      <header className="relative flex min-h-[92vh] w-full items-end justify-center overflow-hidden">
        {cover ? (
          <>
            <Image
              src={cover}
              alt={`${data.brideName} و${data.groomName}`}
              fill
              priority
              sizes="100vw"
              className="object-cover"
              unoptimized
            />
            {/* Scrim: the names have to stay legible over an unknown photo. */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-gt-paper via-gt-paper/45 to-gt-paper/20"
            />
          </>
        ) : (
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,var(--gt-gold-light),transparent_65%)] opacity-25"
          />
        )}

        <Reveal className="relative z-[1] w-full" duration={1.2}>
          <div className="mx-auto max-w-[640px] px-6 pb-[14vh] text-center">
            {data.guest?.name ? (
              <p className="mb-4 text-[13px] tracking-[0.05em] text-gt-ink/60">
                إلى <span className="text-gt-gold">{data.guest.name}</span>
              </p>
            ) : (
              <p className="mb-4 text-[12px] uppercase tracking-[0.4em] text-gt-gold/85">
                دعوة زفاف
              </p>
            )}

            <h1 className="font-heading text-[clamp(40px,12vw,72px)] leading-[1.15] text-gt-ink">
              {data.brideName}
              <span className="mx-3 font-serif italic text-gt-gold">&amp;</span>
              {data.groomName}
            </h1>

            <Ornament className="my-7" />

            <p className="text-[clamp(15px,4vw,18px)] [word-spacing:0.16em] text-gt-ink/70">
              {data.dateDisplay}
            </p>
            {data.dateDetail && (
              <p className="mt-2 text-[14px] text-gt-ink/55">
                {data.dateDetail}
              </p>
            )}
          </div>
        </Reveal>
      </header>

      <main className="relative z-[1] mx-auto flex w-full max-w-[900px] flex-col gap-[clamp(56px,12vw,104px)] px-5 py-[clamp(56px,12vw,104px)]">
        {data.message && (
          <Reveal>
            <p className="mx-auto max-w-[44ch] text-center text-[clamp(16px,4.5vw,19px)] font-light leading-[2] text-gt-ink/75">
              {data.message}
            </p>
          </Reveal>
        )}

        {/* --- Bands ----------------------------------------------------- */}
        {data.story && (
          <Band image={storyImage} title="قصتنا" alt="من ألبوم العروسين">
            <p className="text-[15px] font-light leading-[2] text-gt-ink/70">
              {data.story}
            </p>
          </Band>
        )}

        <Band image={venueImage} title="المكان" alt={data.venueName} flip>
          <p className="text-[clamp(18px,5vw,22px)] text-gt-ink">
            {data.venueName}
          </p>
          <p className="mt-1.5 text-[14px] font-light text-gt-ink/60">
            {data.venueAddress}
          </p>
          <div className="mt-6 grid place-items-start">
            <Countdown targetISO={data.dateISO} />
          </div>
        </Band>

        {data.schedule.length > 0 && (
          <Reveal>
            <section className="text-center">
              <SectionTitle>برنامج الحفل</SectionTitle>
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
            </section>
          </Reveal>
        )}

        {/* --- The rest of the album -------------------------------------- */}
        {gridImages.length > 0 && (
          <Reveal>
            <section>
              <SectionTitle>الألبوم</SectionTitle>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {gridImages.map((url, index) => (
                  <div
                    key={url}
                    className="relative aspect-square overflow-hidden rounded-[2px] border border-gt-gold/20"
                  >
                    <Image
                      src={url}
                      alt={`صورة ${index + 1} من ألبوم العروسين`}
                      fill
                      sizes="(min-width: 640px) 300px, 50vw"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            </section>
          </Reveal>
        )}

        {/* --- Actions ---------------------------------------------------- */}
        <Reveal>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {asksRsvp && (
              <AlbumButton href="#rsvp" primary>
                تأكيد الحضور
                <MailCheck className="size-4" strokeWidth={1.5} />
              </AlbumButton>
            )}
            <AlbumButton href={data.mapUrl} external>
              الاتجاهات
              <ArrowLeft className="size-4" strokeWidth={1.5} />
            </AlbumButton>
            <AlbumButton href={`/i/${data.slug}/calendar`}>
              أضف إلى التقويم
              <CalendarPlus className="size-4" strokeWidth={1.5} />
            </AlbumButton>
          </div>
        </Reveal>

        {asksRsvp && (
          <Reveal>
            <section id="rsvp" className="scroll-mt-24 text-center">
              <SectionTitle>تأكيد الحضور</SectionTitle>
              <div className="mx-auto w-full max-w-[440px] text-start">
                <RsvpForm
                  slug={data.slug}
                  guest={data.guest}
                  maxPartySize={data.maxPartySize}
                  open={data.rsvpOpen}
                  allowOpenRsvp={data.allowOpenRsvp}
                />
              </div>
            </section>
          </Reveal>
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

/**
 * One image-and-text band. `flip` puts the image on the other side so the page
 * zigzags down instead of marching. With no image the text simply takes the
 * full width under an ornament — the band still reads as a deliberate section.
 */
function Band({
  image,
  alt,
  title,
  flip,
  children,
}: {
  image?: string;
  alt: string;
  title: string;
  flip?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Reveal>
      <section
        className={`flex flex-col items-center gap-[clamp(24px,6vw,48px)] sm:flex-row ${
          flip ? "sm:flex-row-reverse" : ""
        }`}
      >
        {image ? (
          <div className="relative aspect-[3/4] w-full shrink-0 overflow-hidden rounded-[2px] border border-gt-gold/25 sm:w-[42%]">
            <Image
              src={image}
              alt={alt}
              fill
              sizes="(min-width: 640px) 380px, 100vw"
              className="object-cover"
              unoptimized
            />
          </div>
        ) : (
          <Ornament className="w-full sm:hidden" />
        )}

        <div className="w-full text-center sm:text-start">
          <SectionTitle className="sm:text-start">{title}</SectionTitle>
          {children}
        </div>
      </section>
    </Reveal>
  );
}

function SectionTitle({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`mb-6 text-center text-[12px] uppercase tracking-[0.32em] text-gt-gold/75 ${className}`}
    >
      {children}
    </h2>
  );
}

/** Matches the other layouts' pill actions, so the three feel like one family. */
function AlbumButton({
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
