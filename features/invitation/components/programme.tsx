import type { InvitationScheduleItem } from "../types";
import { Chapter, ChapterHeading, ChapterWatermark } from "./chapter";
import { Reveal } from "./reveal";
import { ThreadNode } from "./thread-node";

interface ProgrammeProps {
  schedule: InvitationScheduleItem[];
  nodeIndex: number;
}

/** ٠٣ · برنامج الحفل — the evening, hour by hour. */
export function Programme({ schedule, nodeIndex }: ProgrammeProps) {
  return (
    <Chapter className="justify-start py-[14vh] ps-[68px] pe-1.5">
      <ChapterWatermark numeral="3" />
      <ThreadNode index={nodeIndex} className="start-[26px] top-1/2" />

      <div className="relative z-[1] ms-auto w-full max-w-[460px] text-start">
        <ChapterHeading index="٠٣" title="برنامج الحفل" className="mb-7" />

        <Reveal delay={0.2} className="flex flex-col">
          {schedule.map((item, index) => (
            <div
              key={`${item.time}-${item.title}`}
              className={
                "flex items-center gap-5 py-[18px]" +
                (index < schedule.length - 1
                  ? " border-b border-gt-gold/[0.14]"
                  : "")
              }
            >
              {/* Times read left-to-right even in an RTL column. */}
              <span
                dir="ltr"
                className="min-w-[74px] text-left font-serif text-[22px] text-gt-gold/95"
              >
                {item.time}
              </span>
              <span className="text-[clamp(16px,4.6vw,20px)] font-light text-gt-ink">
                {item.title}
              </span>
            </div>
          ))}
        </Reveal>
      </div>
    </Chapter>
  );
}
