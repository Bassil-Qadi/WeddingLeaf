import { Chapter, ChapterHeading, ChapterWatermark } from "./chapter";
import { Countdown } from "./countdown";
import { Reveal } from "./reveal";
import { ThreadNode } from "./thread-node";

interface SaveTheDateProps {
  dateDayMonth: string;
  dateYear: string;
  dateDetail?: string;
  dateISO: string;
  nodeIndex: number;
}

/** ٠٢ · احفظوا التاريخ — the date, and how long is left until it. */
export function SaveTheDate({
  dateDayMonth,
  dateYear,
  dateDetail,
  dateISO,
  nodeIndex,
}: SaveTheDateProps) {
  return (
    <Chapter className="justify-start py-[14vh] ps-[50px] pe-1.5">
      <ChapterWatermark numeral="2" />
      <ThreadNode index={nodeIndex} className="start-[44px] top-1/2" />

      <div className="relative z-[1] ms-auto w-full max-w-[520px] text-start">
        <ChapterHeading index="٠٢" title="احفظوا التاريخ" className="mb-2" />

        <Reveal delay={0.2}>
          <div className="my-[18px] mb-[30px] flex flex-wrap items-baseline justify-start gap-4">
            <span className="text-[clamp(40px,12vw,68px)] font-extralight leading-none text-gt-ink">
              {dateDayMonth}
            </span>
            <span className="font-serif text-[clamp(20px,6vw,30px)] italic text-gt-gold/95">
              {dateYear}
            </span>
          </div>

          {dateDetail && (
            <p className="mb-[34px] text-[15px] tracking-[0.2em] text-gt-ink/60">
              {dateDetail}
            </p>
          )}

          <Countdown targetISO={dateISO} />
        </Reveal>
      </div>
    </Chapter>
  );
}
