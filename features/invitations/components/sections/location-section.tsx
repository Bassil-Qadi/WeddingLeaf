"use client";

import { MapPin } from "lucide-react";

import { SectionTitle } from "../decor/section-title";
import { VenueLineArt } from "../decor/venue-lineart";
import { Reveal } from "../reveal";
import type { Invitation } from "@/types/invitation";

/**
 * "الموقع" — venue name and address over a gold line-art elevation of the
 * hall, then an embedded map the guest can open in Google Maps
 * (assets/envelope.mp4).
 */
export function LocationSection({ invitation }: { invitation: Invitation }) {
  return (
    <section className="relative w-full bg-[var(--inv-cream-deep)] px-6 py-20">
      <Reveal className="mx-auto max-w-md text-center">
        <SectionTitle>الموقع</SectionTitle>

        <p className="mt-8 font-heading text-2xl text-[var(--inv-script)]">
          {invitation.venueName}
        </p>
        <p className="mt-2 font-sans text-sm leading-relaxed text-[var(--inv-ink-soft)]">
          {invitation.venueAddress}
        </p>

        <VenueLineArt className="mx-auto mt-8 h-40 w-full max-w-xs" />

        {invitation.mapEmbedUrl && (
          <div className="mt-8 overflow-hidden rounded-2xl border border-[var(--inv-line)] shadow-[0_18px_44px_-24px_rgba(87,24,38,0.4)]">
            <iframe
              src={invitation.mapEmbedUrl}
              title={`خريطة ${invitation.venueName}`}
              className="h-56 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        )}

        <a
          href={invitation.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--inv-wine)]/30 bg-[var(--inv-wine)]/5 px-5 py-2.5 font-sans text-sm text-[var(--inv-wine)] transition-colors hover:bg-[var(--inv-wine)]/10"
        >
          <MapPin className="size-4" />
          افتح في خرائط جوجل
        </a>
      </Reveal>
    </section>
  );
}
