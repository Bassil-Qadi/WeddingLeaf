import { cn } from "@/lib/utils";

/** `— ◆ —` : two gold hairlines flanking a small open diamond. */
export function Ornament({
  className,
  width = "w-10",
}: {
  className?: string;
  /** The prototype uses 40px in the hero and 38px on the veil. */
  width?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn("flex items-center justify-center gap-3", className)}
    >
      <span
        className={cn(
          "h-px bg-linear-to-r from-transparent to-gt-gold/60",
          width,
        )}
      />
      <span className="size-1.5 rotate-45 border border-gt-gold/75" />
      <span
        className={cn(
          "h-px bg-linear-to-l from-transparent to-gt-gold/60",
          width,
        )}
      />
    </div>
  );
}
