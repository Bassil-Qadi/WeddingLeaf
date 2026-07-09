import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

/**
 * One full-viewport beat of the story. Content is vertically centered and the
 * thread runs down the RTL-leading (right) edge, so chapters pad that side
 * generously to clear the thread and its nodes.
 */
export function Chapter({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("relative flex min-h-screen items-center", className)}>
      {children}
    </section>
  );
}

/** The oversized ghosted numeral sitting behind a chapter for depth. */
export function ChapterWatermark({ numeral }: { numeral: string }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute end-0.5 top-1/2 z-0 -translate-y-1/2 font-serif text-[clamp(150px,32vw,240px)] leading-[0.8] text-gt-gold/[0.07]"
    >
      {numeral}
    </span>
  );
}

/** The `٠١ / قصتنا` pair that opens every chapter. */
export function ChapterHeading({
  index,
  title,
  className,
}: {
  /** Arabic-Indic chapter number, e.g. "٠١". */
  index: string;
  title: string;
  className?: string;
}) {
  return (
    <>
      <Reveal className="mb-4 font-serif text-[15px] tracking-[0.34em] text-gt-gold/95">
        {index}
      </Reveal>
      <Reveal delay={0.1} duration={1}>
        <h2
          className={cn(
            "text-[clamp(28px,7vw,40px)] font-normal text-gt-ink",
            className,
          )}
        >
          {title}
        </h2>
      </Reveal>
    </>
  );
}
