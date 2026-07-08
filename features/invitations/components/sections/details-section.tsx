"use client";

import { Shirt, Gift } from "lucide-react";

import { FloralSpray } from "../decor/floral-spray";
import { SectionTitle } from "../decor/section-title";
import { RevealGroup, RevealItem } from "../reveal";
import type { Invitation } from "@/types/invitation";

/**
 * "تفاصيل تهمّكم" — the courtesy notes (dress code, gifts) presented as
 * frosted cards, each crowned with a gilt icon and cascading into view.
 * Reference: assets/envelope.mp4 ("Dress Code" / "Gift Preference").
 */
export function DetailsSection({ invitation }: { invitation: Invitation }) {
  const cards = [
    invitation.dressCodeNote && {
      icon: Shirt,
      title: "قواعد اللباس",
      body: invitation.dressCodeNote,
      tag: invitation.dressCode,
    },
    invitation.giftPreference && {
      icon: Gift,
      title: "الهدايا",
      body: invitation.giftPreference,
    },
  ].filter(Boolean) as Array<{
    icon: typeof Shirt;
    title: string;
    body: string;
    tag?: string;
  }>;

  if (!cards.length) return null;

  return (
    <section className="relative w-full overflow-hidden bg-[var(--inv-cream)] px-6 py-20">
      <FloralSpray
        flip
        className="pointer-events-none absolute -right-8 -top-4 h-36 w-36 opacity-90"
      />
      <FloralSpray className="pointer-events-none absolute -bottom-4 -left-8 h-36 w-36 rotate-180 opacity-90" />

      <div className="relative mx-auto max-w-md">
        <SectionTitle>تفاصيل تهمّكم</SectionTitle>

        <RevealGroup className="mt-10 flex flex-col gap-5">
          {cards.map(({ icon: Icon, title, body, tag }) => (
            <RevealItem key={title}>
              <div className="inv-glass rounded-2xl p-6 text-center">
                <span className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full border border-[var(--inv-gold)]/40 bg-[var(--inv-cream)] text-[var(--inv-gold)] shadow-[0_6px_16px_-8px_rgba(201,162,74,0.7)]">
                  <Icon className="size-5" />
                </span>
                <h3 className="font-heading text-2xl text-[var(--inv-script)]">{title}</h3>
                {tag && (
                  <span className="mt-2 inline-block rounded-full border border-[var(--inv-line)] bg-white/50 px-3 py-1 font-sans text-xs text-[var(--inv-ink-soft)]">
                    {tag}
                  </span>
                )}
                <p className="mx-auto mt-3 max-w-sm font-sans text-[15px] leading-loose text-[var(--inv-ink)]">
                  {body}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
