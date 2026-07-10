import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PhotoFrameProps {
  src?: string;
  alt: string;
  /** Shown in the empty frame before the couple has uploaded this photo. */
  placeholder: string;
  /** Utilities sizing the image well, e.g. `aspect-[3/4]` or `h-[220px]`. */
  wellClassName: string;
  /** The matte around the image: 9px for the portrait, 8px for the venue. */
  matteClassName?: string;
  className?: string;
  /** Two L-shaped corner accents, as on the couple portrait. */
  corners?: boolean;
}

/**
 * A matte gold frame — a hairline border with a paper mount inside, and
 * optional corner accents that lift off the frame like photo mounts.
 *
 * Images come from the couple's uploads, so they are arbitrary remote URLs:
 * `unoptimized` keeps them out of the optimizer, which would otherwise
 * reject any hostname not listed in `next.config.ts`.
 */
export function PhotoFrame({
  src,
  alt,
  placeholder,
  wellClassName,
  matteClassName = "p-[9px]",
  className,
  corners = false,
}: PhotoFrameProps) {
  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "relative border border-gt-gold/[0.32] bg-[rgba(255,252,246,0.5)]",
          matteClassName,
        )}
      >
        <div className={cn("relative w-full", wellClassName)}>
          {src ? (
            <Image
              src={src}
              alt={alt}
              fill
              unoptimized
              sizes="(max-width: 680px) 100vw, 340px"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#ece3d3] text-gt-gold">
              <ImageIcon className="size-6 opacity-70" strokeWidth={1.25} />
              <span className="text-[13px] [word-spacing:0.06em]">
                {placeholder}
              </span>
            </div>
          )}
        </div>
      </div>

      {corners && (
        <>
          <span
            aria-hidden="true"
            className="absolute -top-[7px] -right-[7px] size-4 border-t border-r border-gt-gold/60"
          />
          <span
            aria-hidden="true"
            className="absolute -bottom-[7px] -left-[7px] size-4 border-b border-l border-gt-gold/60"
          />
        </>
      )}
    </div>
  );
}
