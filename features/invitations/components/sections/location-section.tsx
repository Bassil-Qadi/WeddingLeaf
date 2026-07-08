"use client";

import { motion } from "framer-motion";
import { MapPin, Navigation } from "lucide-react";

import { SectionTitle } from "../decor/section-title";
import { VenueLineArt } from "../decor/venue-lineart";
import { Reveal } from "../reveal";
import { EASE_OUT } from "../../lib/anim";
import type { Invitation } from "@/types/invitation";

/**
 * "الموقع" — venue name and address over a gilt line-art elevation of the
 * hall on a frosted card, then an embedded map and a call-to-action that
 * opens directions in Google Maps. Reference: assets/envelope.mp4.
 */
export function LocationSection({ invitation }: { invitation: Invitation }) {
  return (
    <section className="relative w-full bg-[var(--inv-cream-deep)] px-6 py-20">
      <Reveal className="mx-auto max-w-md text-center">
        <SectionTitle>الموقع</SectionTitle>

        <div className="inv-glass mt-10 rounded-3xl px-6 pb-6 pt-8">
          <p className="inline-flex items-center gap-2 font-sans text-xs tracking-[0.24em] text-[var(--inv-ink-soft)]">
            <MapPin className="size-3.5 text-[var(--inv-gold)]" />
            {invitation.city}
          </p>
          <p className="mt-3 font-heading text-3xl text-[var(--inv-script)]">
            {invitation.venueName}
          </p>
          <p className="mt-2 font-sans text-sm leading-relaxed text-[var(--inv-ink-soft)]">
            {invitation.venueAddress}
          </p>

          <VenueLineArt className="mx-auto mt-6 h-36 w-full max-w-xs" />

          {invitation.mapEmbedUrl && (
            <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--inv-line)] shadow-[0_18px_44px_-24px_rgba(87,24,38,0.4)]">
              <iframe
                src={invitation.mapEmbedUrl}
                title={`خريطة ${invitation.venueName}`}
                className="h-52 w-full grayscale-[0.15] transition-[filter] duration-500 hover:grayscale-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          )}

          <motion.a
            href={invitation.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--inv-wine)] px-6 py-3 font-sans text-sm text-[var(--inv-cream)] shadow-[0_14px_30px_-14px_rgba(87,24,38,0.8)]"
          >
            <Navigation className="size-4" />
            احصل على الاتجاهات
          </motion.a>
        </div>
      </Reveal>
    </section>
  );
}
