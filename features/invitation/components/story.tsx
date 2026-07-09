import { Chapter, ChapterHeading } from "./chapter";
import { PhotoFrame } from "./photo-frame";
import { Reveal } from "./reveal";
import { ThreadNode } from "./thread-node";

interface StoryProps {
  story: string;
  photoUrl?: string;
  nodeIndex: number;
}

/** ٠١ · قصتنا — the narrative, beside the couple's portrait. */
export function Story({ story, photoUrl, nodeIndex }: StoryProps) {
  return (
    <Chapter className="flex-row flex-wrap justify-between gap-[clamp(28px,5vw,56px)] py-[14vh] ps-[68px] pe-6">
      <ThreadNode index={nodeIndex} className="start-[26px] top-1/2" />

      <div className="relative z-[1] min-w-[260px] flex-[1_1_280px] text-start">
        <ChapterHeading index="٠١" title="قصتنا" className="mb-[22px]" />

        <Reveal delay={0.2}>
          <p className="text-[clamp(16px,4.4vw,19px)] font-light leading-[2.1] text-gt-ink/[0.74] text-pretty">
            {story}
          </p>
        </Reveal>
      </div>

      <Reveal
        delay={0.15}
        duration={1.1}
        className="relative z-[1] min-w-[220px] flex-[0_1_300px]"
      >
        <PhotoFrame
          src={photoUrl}
          alt="صورة العروسين"
          placeholder="صورة العروسين"
          wellClassName="aspect-[3/4]"
          corners
        />
      </Reveal>
    </Chapter>
  );
}
