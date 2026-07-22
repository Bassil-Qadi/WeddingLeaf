"use client";

import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import type { WeddingTemplate } from "@/types/invitation";
import {
  TEMPLATE_DESCRIPTIONS,
  TEMPLATE_OPTIONS,
} from "@/lib/wedding-templates";

interface TemplatePickerProps {
  value: WeddingTemplate;
  onChange: (value: WeddingTemplate) => void;
  /** The selected palette's accent, so the thumbnails preview the colour too. */
  accent: string;
}

/**
 * The layout chooser — a radio group of wireframe thumbnails, so a couple sees
 * the shape of each invitation experience instead of picking a name blind. The
 * thumbnails tint with the currently-selected palette, making the two axes
 * (layout × colour) legible together.
 */
export function TemplatePicker({ value, onChange, accent }: TemplatePickerProps) {
  return (
    <div
      role="radiogroup"
      aria-label="تصميم الدعوة"
      className="grid grid-cols-2 gap-3 sm:grid-cols-3"
    >
      {TEMPLATE_OPTIONS.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.value)}
            className={cn(
              "group relative flex flex-col gap-2.5 rounded-xl border p-2.5 text-start transition-colors",
              selected
                ? "border-primary ring-2 ring-primary/25"
                : "border-input hover:border-primary/40",
            )}
          >
            <span
              className="relative block h-24 w-full overflow-hidden rounded-lg border border-black/5 bg-muted/40"
              style={{ color: accent }}
            >
              <TemplateThumb template={option.value} />
            </span>

            <span className="flex flex-col gap-0.5">
              <span className="text-sm font-medium text-foreground">
                {option.label}
              </span>
              <span className="text-[11px] leading-snug text-muted-foreground">
                {TEMPLATE_DESCRIPTIONS[option.value]}
              </span>
            </span>

            {selected && (
              <span className="absolute end-2 top-2 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check className="size-3" strokeWidth={2.5} />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/** Dispatch to the right wireframe. `currentColor` carries the palette accent. */
function TemplateThumb({ template }: { template: WeddingTemplate }) {
  if (template === "card") return <CardThumb />;
  if (template === "album") return <AlbumThumb />;
  if (template === "envelope") return <EnvelopeThumb />;
  if (template === "doors") return <DoorsThumb />;
  if (template === "veil") return <VeilThumb />;
  if (template === "gem") return <GemThumb />;
  if (template === "aurelia") return <AureliaThumb />;
  return <ThreadThumb />;
}

/** A vertical thread with nodes and staggered chapter bars — the scroll layout. */
function ThreadThumb() {
  const rows = [22, 50, 78];
  return (
    <span aria-hidden="true" className="absolute inset-0" dir="rtl">
      {/* the thread */}
      <span className="absolute inset-y-3 start-1/2 w-px -translate-x-1/2 bg-current opacity-45" />
      {rows.map((top, i) => (
        <span key={top}>
          {/* node on the thread */}
          <span
            className="absolute start-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-current bg-white"
            style={{ top: `${top}%` }}
          />
          {/* chapter bars, alternating sides */}
          <span
            className="absolute flex -translate-y-1/2 flex-col gap-1"
            style={{
              top: `${top}%`,
              [i % 2 === 0 ? "insetInlineStart" : "insetInlineEnd"]: "12%",
            }}
          >
            <span className="h-1 w-8 rounded-full bg-current opacity-70" />
            <span className="h-1 w-5 rounded-full bg-foreground/15" />
          </span>
        </span>
      ))}
    </span>
  );
}

/** A photo block over alternating image/text bands — the album layout. */
function AlbumThumb() {
  return (
    <span aria-hidden="true" className="absolute inset-0 flex flex-col" dir="rtl">
      {/* the full-bleed cover, with the names sitting low over it */}
      <span className="relative flex h-[52%] w-full items-end justify-center bg-current opacity-90">
        <span className="mb-2 h-1.5 w-12 rounded-full bg-white/85" />
      </span>
      {/* alternating bands beneath it */}
      <span className="flex flex-1 flex-col justify-center gap-1.5 px-2.5">
        <span className="flex items-center gap-1.5">
          <span className="h-5 w-5 shrink-0 rounded-[2px] bg-current opacity-45" />
          <span className="flex flex-1 flex-col gap-1">
            <span className="h-1 w-full rounded-full bg-foreground/20" />
            <span className="h-1 w-2/3 rounded-full bg-foreground/15" />
          </span>
        </span>
        <span className="flex flex-row-reverse items-center gap-1.5">
          <span className="h-5 w-5 shrink-0 rounded-[2px] bg-current opacity-45" />
          <span className="flex flex-1 flex-col items-end gap-1">
            <span className="h-1 w-full rounded-full bg-foreground/20" />
            <span className="h-1 w-2/3 rounded-full bg-foreground/15" />
          </span>
        </span>
      </span>
    </span>
  );
}

/**
 * A wax-sealed envelope with its flap folded — the `envelope` royal cover. The
 * three royal thumbnails all centre a round gold seal, so the family reads as
 * one at a glance while each opening differs.
 */
function EnvelopeThumb() {
  return (
    <span
      aria-hidden="true"
      className="absolute inset-0 flex items-center justify-center p-2.5"
    >
      <span className="relative h-full w-[74%] overflow-hidden rounded-[3px] border border-current">
        {/* the flap — a triangle meeting at the seal */}
        <span
          className="absolute inset-x-0 top-0 h-1/2 bg-current opacity-25"
          style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
        />
        {/* inner hairline */}
        <span className="pointer-events-none absolute inset-[3px] rounded-[2px] border border-current opacity-30" />
        {/* the seal at the flap's tip */}
        <Seal />
      </span>
    </span>
  );
}

/** Two gilded panels parted around a seal — the `doors` royal cover. */
function DoorsThumb() {
  return (
    <span
      aria-hidden="true"
      className="absolute inset-0 flex items-stretch justify-center gap-[3px] p-2.5"
    >
      <span className="relative flex-1 rounded-s-[3px] border border-current bg-current opacity-25" />
      <span className="relative flex-1 rounded-e-[3px] border border-current bg-current opacity-25" />
      {/* the seal on the seam */}
      <Seal />
    </span>
  );
}

/** A veil half-lifted off a seal — the `veil` royal cover. */
function VeilThumb() {
  return (
    <span
      aria-hidden="true"
      className="absolute inset-0 flex items-center justify-center p-2.5"
    >
      <span className="relative h-full w-[74%] overflow-hidden rounded-[3px] border border-current">
        {/* the veil, lifted to reveal the lower half */}
        <span className="absolute inset-x-0 top-0 h-[42%] bg-current opacity-30" />
        <span className="absolute inset-x-0 top-[42%] h-px bg-current opacity-50" />
        <Seal />
      </span>
    </span>
  );
}

/**
 * A faceted jewel glowing on a glass panel — the `gem` layout. A rotated square
 * crossed by facet lines reads as a cut stone; the blurred halo behind it and
 * the frosted plate stand in for the aura and glass of the real thing.
 */
function GemThumb() {
  return (
    <span
      aria-hidden="true"
      className="absolute inset-0 flex items-center justify-center p-2.5"
    >
      {/* glass plate */}
      <span className="relative flex h-full w-[74%] items-center justify-center rounded-[6px] border border-current">
        <span className="pointer-events-none absolute inset-0 rounded-[5px] bg-current opacity-[0.08]" />
        {/* aura */}
        <span className="absolute size-9 rounded-full bg-current opacity-25 blur-md" />
        {/* the faceted stone */}
        <span className="relative size-6 rotate-45 border border-current bg-current opacity-90">
          <span className="absolute inset-0 border-b border-white/50" />
          <span className="absolute inset-0 rotate-90 border-b border-white/40" />
        </span>
      </span>
    </span>
  );
}

/**
 * A glowing ring portal on a dark cover — the `aurelia` layout. A blurred aura
 * behind a hollow ring, with a couple of drifting light particles, stands in for
 * the kinetic portal that zooms open into the story.
 */
function AureliaThumb() {
  return (
    <span
      aria-hidden="true"
      className="absolute inset-0 flex items-center justify-center p-2.5"
    >
      <span className="relative flex h-full w-[74%] items-center justify-center overflow-hidden rounded-[6px] border border-current">
        {/* inset frame */}
        <span className="pointer-events-none absolute inset-[3px] rounded-[4px] border border-current opacity-30" />
        {/* aura bloom */}
        <span className="absolute size-10 rounded-full bg-current opacity-25 blur-md" />
        {/* the portal ring */}
        <span className="relative flex size-7 items-center justify-center rounded-full border-2 border-current">
          <span className="size-1.5 rounded-full bg-current opacity-80" />
        </span>
        {/* drifting particles */}
        <span className="absolute bottom-2 start-3 size-1 rounded-full bg-current opacity-60" />
        <span className="absolute bottom-4 end-3.5 size-[3px] rounded-full bg-current opacity-45" />
      </span>
    </span>
  );
}

/** The shared round gold seal centred on every royal cover thumbnail. */
function Seal() {
  return (
    <span className="absolute start-1/2 top-1/2 flex size-4 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-current shadow-sm">
      <span className="size-1.5 rounded-full border border-white/70" />
    </span>
  );
}

/** A centered framed panel with names, date, and a button row — the card layout. */
function CardThumb() {
  return (
    <span
      aria-hidden="true"
      className="absolute inset-0 flex items-center justify-center p-3"
    >
      <span className="relative flex h-full w-[68%] flex-col items-center justify-center gap-1.5 rounded-[3px] border border-current px-2">
        {/* inner hairline, echoing the card's printed frame */}
        <span className="pointer-events-none absolute inset-[3px] rounded-[2px] border border-current opacity-40" />
        {/* names */}
        <span className="h-1.5 w-12 rounded-full bg-foreground/25" />
        {/* ornament */}
        <span className="my-0.5 h-px w-8 bg-current opacity-60" />
        {/* date */}
        <span className="h-1 w-9 rounded-full bg-current opacity-70" />
        {/* button row */}
        <span className="mt-1.5 flex gap-1">
          <span className="h-1.5 w-3.5 rounded-full border border-current" />
          <span className="h-1.5 w-3.5 rounded-full border border-current" />
          <span className="h-1.5 w-3.5 rounded-full border border-current" />
        </span>
      </span>
    </span>
  );
}
