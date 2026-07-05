"use client";

import { motion } from "framer-motion";
import { PageContainer } from "@/components/common/page-container";
import { Section } from "@/components/common/section";
import { motion as motionPreset } from "@/config/motion";
import { BackgroundGradient } from "@/components/common/background-gradient";
import { FloatingLeaf } from "@/components/animation/floating-leaf";

export function Hero() {
  return (
    <Section className="relative overflow-hidden">
      <BackgroundGradient />

      <FloatingLeaf className="absolute left-20 top-40 text-4xl opacity-40" />

      <FloatingLeaf className="absolute right-20 top-60 text-5xl opacity-30" />

      <PageContainer>

        <div className="mx-auto max-w-4xl py-24 text-center">

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={motionPreset.fast}
            className="mb-5 text-primary tracking-[0.4em]"
          >
            WEDDINGLEAF
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={motionPreset.luxury}
            className="font-heading text-6xl leading-tight"
          >
            اصنع دعوة زفاف
            <br />
            تبقى في الذاكرة
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={motionPreset.cinematic}
            className="mx-auto mt-8 max-w-2xl text-lg text-muted-foreground"
          >
            تجربة تفاعلية تبدأ منذ لحظة فتح الظرف،
            وتنتهي بتأكيد حضور ضيوفك في دقائق.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={motionPreset.cinematic}
            className="mt-12 flex justify-center gap-5"
          >
            <button className="rounded-full bg-primary px-8 py-4 text-primary-foreground">
              ابدأ الآن
            </button>

            <button className="rounded-full border px-8 py-4">
              مشاهدة العرض
            </button>
          </motion.div>

        </div>

      </PageContainer>

    </Section>
  );
}