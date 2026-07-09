import { Reveal } from "./reveal";
import { ThreadNode } from "./thread-node";

interface ClosingProps {
  brideName: string;
  groomName: string;
  monogram: string;
  hashtag: string;
  dateNumeric: string;
  rsvpPhone?: string;
  nodeIndex: number;
}

/** The thread returns to the center and ties itself off. */
export function Closing({
  brideName,
  groomName,
  monogram,
  hashtag,
  dateNumeric,
  rsvpPhone,
  nodeIndex,
}: ClosingProps) {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-2 py-[16vh] text-center">
      <ThreadNode
        index={nodeIndex}
        kind="knot"
        className="left-1/2 top-[calc(50%-150px)]"
      />

      <Reveal duration={1.1} className="flex flex-col items-center">
        <div className="gt-breathe mb-[34px] flex size-[86px] items-center justify-center rounded-full border border-gt-gold/45">
          <span className="font-serif text-[28px] tracking-[0.1em] text-gt-gold">
            {monogram}
          </span>
        </div>

        <p className="mb-[26px] max-w-[320px] text-[clamp(20px,5.6vw,28px)] font-light leading-[1.7] text-gt-ink">
          بحضوركم تكتمل فرحتنا
        </p>

        <div
          aria-hidden="true"
          className="mb-[22px] h-px w-10 bg-linear-to-r from-transparent via-gt-gold/60 to-transparent"
        />

        {rsvpPhone && (
          <p className="mb-2 text-[13px] tracking-[0.1em] text-gt-ink/60">
            لتأكيد الحضور: {rsvpPhone}
          </p>
        )}

        <p className="mb-[26px] text-[13px] tracking-[0.14em] text-gt-gold/90">
          {hashtag}
        </p>

        <p
          dir="ltr"
          className="font-serif text-[13px] tracking-[0.28em] text-gt-ink/55"
        >
          {brideName} &amp; {groomName} · {dateNumeric}
        </p>
      </Reveal>
    </section>
  );
}
