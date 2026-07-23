"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Play, Sparkles } from "lucide-react";

import { PageContainer } from "@/components/common/page-container";
import { AuroraField, EASE, GoldText } from "./primitives";
import { InvitationReveal } from "./invitation-reveal";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const TRUST = ["٨ تصاميم فاخرة", "مشاركة عبر واتساب", "تتبّع الحضور", "أربع لوحات ألوان"];

/**
 * The opening act — a split hero pairing the promise (right, in RTL) with a
 * living invitation mockup (left). The copy staggers in on load; the mockup
 * floats and tilts under the pointer.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28">
      <AuroraField />
      {/* a hairline of gold light along the very top */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
      />

      <PageContainer>
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-10">
          {/* --- Copy --- */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="text-center lg:text-start"
          >
            <motion.span
              variants={item}
              className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-4 py-1.5 text-xs tracking-[0.18em] text-primary"
            >
              <Sparkles className="size-3.5" strokeWidth={1.75} />
              دعوات زفاف رقمية فاخرة
            </motion.span>

            <motion.h1
              variants={item}
              className="mt-7 font-heading text-5xl leading-[1.12] text-foreground sm:text-6xl lg:text-[68px]"
            >
              اصنع دعوة زفاف
              <br />
              <GoldText shimmer>تبقى في الذاكرة</GoldText>
            </motion.h1>

            <motion.p
              variants={item}
              className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground lg:mx-0"
            >
              تجربة تفاعلية تبدأ منذ لحظة فتح الدعوة، وتنتهي بتأكيد حضور ضيوفك في
              دقائق — بتصاميم سينمائية وتفاصيل مصنوعة بعناية.
            </motion.p>

            <motion.div
              variants={item}
              className="mt-10 flex flex-wrap items-center justify-center gap-4 lg:justify-start"
            >
              <Link
                href="/auth/sign-up"
                className="group inline-flex items-center gap-2.5 rounded-full bg-primary px-8 py-4 text-base font-medium text-primary-foreground shadow-[0_16px_40px_-14px_rgba(198,168,106,1)] transition-all hover:scale-[1.03]"
              >
                ابدأ الآن مجانًا
                <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" strokeWidth={2} />
              </Link>
              <Link
                href="/demo?template=aurelia"
                className="group inline-flex items-center gap-2.5 rounded-full border border-primary/30 bg-background/50 px-8 py-4 text-base text-foreground backdrop-blur-sm transition-colors hover:border-primary/60 hover:bg-primary/5"
              >
                <Play className="size-4 text-primary" strokeWidth={1.75} />
                شاهد نموذجًا حيًّا
              </Link>
            </motion.div>

            <motion.ul
              variants={item}
              className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-muted-foreground lg:justify-start"
            >
              {TRUST.map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <span className="size-1.5 rotate-45 bg-primary/70" />
                  {t}
                </li>
              ))}
            </motion.ul>
          </motion.div>

          {/* --- Visual --- */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.1, ease: EASE, delay: 0.25 }}
            className="relative"
          >
            <InvitationReveal />
          </motion.div>
        </div>
      </PageContainer>

      <ScrollCue />
    </section>
  );
}

/** A breathing "scroll on" cue at the foot of the hero. */
function ScrollCue() {
  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.4, duration: 0.8 }}
      className="mt-16 flex justify-center lg:mt-24"
    >
      <div className="flex flex-col items-center gap-2">
        <span className="text-[10px] tracking-[0.3em] text-muted-foreground">
          اكتشف المزيد
        </span>
        <motion.span
          animate={{ y: [0, 8, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.8, ease: "easeInOut", repeat: Infinity }}
          className="h-8 w-px bg-gradient-to-b from-primary to-transparent"
        />
      </div>
    </motion.div>
  );
}
