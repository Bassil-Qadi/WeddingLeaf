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
    <div role="radiogroup" aria-label="تصميم الدعوة" className="grid grid-cols-2 gap-3">
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
  return template === "card" ? <CardThumb /> : <ThreadThumb />;
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
