import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Chapter, ChapterHeading } from "./chapter";
import { PhotoFrame } from "./photo-frame";
import { Reveal } from "./reveal";
import { ThreadNode } from "./thread-node";

interface VenueProps {
  venueName: string;
  venueAddress: string;
  mapUrl: string;
  photoUrl?: string;
  nodeIndex: number;
}

/** ٠٤ · المكان — where, and how to get there. */
export function Venue({
  venueName,
  venueAddress,
  mapUrl,
  photoUrl,
  nodeIndex,
}: VenueProps) {
  return (
    <Chapter className="justify-start py-[14vh] ps-11 pe-1.5">
      <ThreadNode index={nodeIndex} className="start-[44px] top-1/2" />

      <div className="relative z-[1] ms-auto w-full max-w-[520px] text-start">
        <ChapterHeading index="٠٤" title="المكان" className="mb-2.5" />

        <Reveal delay={0.2}>
          <p className="mb-1.5 text-[clamp(19px,5.4vw,24px)] text-gt-ink">
            {venueName}
          </p>
          <p className="mb-[22px] text-[15px] font-light text-gt-ink/60">
            {venueAddress}
          </p>

          <PhotoFrame
            src={photoUrl}
            alt={`صورة ${venueName}`}
            placeholder="صورة القاعة"
            wellClassName="h-[220px]"
            matteClassName="p-2"
          />

          <Button
            variant="ghost"
            nativeButton={false}
            render={
              <a href={mapUrl} target="_blank" rel="noopener noreferrer" />
            }
            className="mt-[22px] h-auto gap-2.5 rounded-full border border-gt-gold/45 px-[26px] py-[13px] text-sm font-normal [word-spacing:0.06em] text-gt-gold-btn transition-colors duration-400 hover:border-gt-gold/75 hover:bg-gt-gold/10 hover:text-gt-gold-btn"
          >
            احصلوا على الاتجاهات
            <ArrowLeft className="size-4" strokeWidth={1.5} />
          </Button>
        </Reveal>
      </div>
    </Chapter>
  );
}
