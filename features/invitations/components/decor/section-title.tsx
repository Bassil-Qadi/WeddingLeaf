import type { ReactNode } from "react";

function Flourish({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 20"
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="var(--inv-gold)"
      strokeWidth="1.2"
      strokeLinecap="round"
    >
      <path d="M2 10 H 40" opacity="0.7" />
      <path d="M40 10 q 6 -6 12 -3 q -5 1 -6 3 q 1 2 6 3 q -6 3 -12 -3 Z" fill="var(--inv-gold)" fillOpacity="0.5" />
      <circle cx="2" cy="10" r="1.4" fill="var(--inv-gold)" stroke="none" />
    </svg>
  );
}

/**
 * A script section heading (Amiri) flanked by mirrored gold flourishes —
 * the recurring "Schedule of Events" / "Location" / "Confirm Your
 * Attendance" title treatment from the reference (assets/envelope.mp4).
 */
export function SectionTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className ?? ""}`}>
      <Flourish className="h-4 w-12 scale-x-[-1] opacity-90" />
      <h2 className="font-heading text-2xl leading-tight text-[var(--inv-script)] sm:text-3xl">
        {children}
      </h2>
      <Flourish className="h-4 w-12 opacity-90" />
    </div>
  );
}
