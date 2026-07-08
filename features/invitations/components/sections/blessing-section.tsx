"use client";

import { motion } from "framer-motion";

import { FloralSpray } from "../decor/floral-spray";
import { Reveal, RevealGroup, RevealItem } from "../reveal";
import { EASE_OUT, inView } from "../../lib/anim";
import type { Invitation } from "@/types/invitation";

/**
 * The invocation — three short poetic lines under a floral crown that surface
 * one after another, a gilt divider that draws itself, and the warm welcome
 * to guests. (assets/envelope.mp4, rendered in Arabic.)
 */
export function BlessingSection({ invitation }: { invitation: Invitation }) {
  const tagline = invitation.tagline ?? [];

  return (
    <section className="relative w-full overflow-hidden bg-[var(--inv-cream)] px-6 pb-20 pt-16">
      {/* floral crown */}
      <FloralSpray className="pointer-events-none absolute -left-6 -top-2 h-32 w-32 -rotate-12 opacity-90" />
      <FloralSpray
        flip
        className="pointer-events-none absolute -right-6 -top-2 h-32 w-32 rotate-12 opacity-90"
      />

      <div className="mx-auto mt-10 max-w-md text-center">
        <RevealGroup className="flex flex-col items-center gap-1">
          {tagline.map((line, i) => (
            <RevealItem key={i}>
              <p className="font-heading text-3xl text-[var(--inv-script)] sm:text-4xl">
                {line}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* self-drawing gilt divider with a centre diamond */}
        <div className="my-9 flex items-center justify-center gap-3">
          <motion.span
            className="h-px w-16 origin-right bg-gradient-to-l from-[var(--inv-gold)] to-transparent"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={inView}
            transition={{ duration: 0.8, ease: EASE_OUT }}
          />
          <motion.span
            className="size-2 rotate-45 bg-[var(--inv-gold)]"
            initial={{ scale: 0, rotate: 0 }}
            whileInView={{ scale: 1, rotate: 45 }}
            viewport={inView}
            transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.4 }}
          />
          <motion.span
            className="h-px w-16 origin-left bg-gradient-to-r from-[var(--inv-gold)] to-transparent"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={inView}
            transition={{ duration: 0.8, ease: EASE_OUT }}
          />
        </div>

        {invitation.message && (
          <Reveal delay={0.1}>
            <p className="font-sans text-[15px] leading-loose text-[var(--inv-ink)]">
              {invitation.message}
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
