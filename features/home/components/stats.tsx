"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

import { PageContainer } from "@/components/common/page-container";
import { Reveal } from "./primitives";

const STATS = [
  { value: 8, suffix: "", label: "تصاميم قابلة للتخصيص" },
  { value: 4, suffix: "", label: "لوحات ألوان فاخرة" },
  { value: 100, suffix: "٪", label: "متوافقة مع الجوّال" },
  { value: null, display: "∞", label: "عدد الضيوف بلا حدود" },
] as const;

/** A quiet band of figures that counts up the first time it scrolls into view. */
export function Stats() {
  return (
    <section className="relative border-y border-primary/10 bg-white/40 py-14">
      <PageContainer>
        <Reveal>
          <dl className="grid grid-cols-2 gap-y-10 sm:grid-cols-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-2 border-primary/10 text-center sm:border-s sm:first:border-s-0"
              >
                <dd className="font-heading text-5xl text-foreground">
                  {stat.value === null ? (
                    stat.display
                  ) : (
                    <>
                      <CountUp to={stat.value} />
                      {stat.suffix}
                    </>
                  )}
                </dd>
                <dt className="max-w-[9rem] text-sm leading-snug text-muted-foreground">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>
        </Reveal>
      </PageContainer>
    </section>
  );
}

/** Counts from zero to `to` once, when it enters the viewport. */
function CountUp({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduceMotion = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    // Driving the value through `animate` (even at duration 0 for reduced
    // motion) keeps the state update inside a callback, not the effect body.
    const controls = animate(0, to, {
      duration: reduceMotion ? 0 : 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setValue(Math.round(latest)),
      onComplete: () => setValue(to),
    });
    return () => controls.stop();
  }, [inView, to, reduceMotion]);

  return <span ref={ref}>{value.toLocaleString("ar-EG")}</span>;
}
