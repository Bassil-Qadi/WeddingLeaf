"use client";

import { motion } from "framer-motion";

import { PageContainer } from "@/components/common/page-container";
import { EASE, SectionHeading } from "./primitives";

const STEPS = [
  {
    n: "١",
    title: "اختر تصميمك",
    body: "ابدأ من ثمانية تصاميم وأربع لوحات ألوان، واعثر على الطابع الذي يشبه حفلكما.",
  },
  {
    n: "٢",
    title: "خصّص التفاصيل",
    body: "الأسماء، الموعد، المكان، الصور، وبرنامج الحفل — كل شيء يتحدّث لحظيًّا أمام عينيك.",
  },
  {
    n: "٣",
    title: "شارك وتابع",
    body: "أرسل الرابط عبر واتساب، وتابع تأكيدات الحضور وعدد المقاعد من لوحة واحدة.",
  },
];

/** Three numbered steps on a hairline gold spine. */
export function HowItWorks() {
  return (
    <section id="how" className="relative scroll-mt-24 bg-white/40 py-24 lg:py-32">
      <PageContainer>
        <SectionHeading
          eyebrow="كيف تعمل"
          title="من الفكرة إلى الدعوة في دقائق"
        />

        <div className="relative mx-auto mt-16 grid max-w-5xl gap-12 md:grid-cols-3 md:gap-8">
          {/* the connecting spine (desktop) */}
          <span
            aria-hidden="true"
            className="absolute inset-x-[16%] top-8 hidden h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent md:block"
          />

          {STEPS.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, ease: EASE, delay: i * 0.12 }}
              className="relative flex flex-col items-center text-center"
            >
              <span className="relative z-[1] grid size-16 place-items-center rounded-full border border-primary/30 bg-background font-heading text-2xl text-primary shadow-[0_10px_30px_-12px_rgba(198,168,106,0.8)]">
                {step.n}
              </span>
              <h3 className="mt-6 font-heading text-2xl text-foreground">
                {step.title}
              </h3>
              <p className="mt-3 max-w-xs leading-relaxed text-muted-foreground">
                {step.body}
              </p>
            </motion.div>
          ))}
        </div>
      </PageContainer>
    </section>
  );
}
