import { cn } from "@/lib/utils";

type SectionProps = React.HTMLAttributes<HTMLElement>;

export function Section({
  className,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(
        "py-20 lg:py-28",
        className
      )}
      {...props}
    />
  );
}