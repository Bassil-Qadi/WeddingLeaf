"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

import { PageContainer } from "@/components/common/page-container";
import {
  TEMPLATE_DESCRIPTIONS,
  TEMPLATE_OPTIONS,
} from "@/lib/wedding-templates";
import { AuroraField, EASE, SectionHeading } from "./primitives";

/** A gilded index numeral, in Arabic-Indic digits, sitting on each card. */
const INDEX = ["١", "٢", "٣", "٤", "٥", "٦", "٧", "٨"];

/**
 * The layouts gallery — every shipped template, each a link into its own live
 * demo. Drawing the labels/descriptions from `wedding-templates` keeps this in
 * lock-step with the picker and the dispatcher: add a template there, it appears
 * here.
 */
export function TemplatesShowcase() {
  return (
    <section
      id="templates"
      className="relative scroll-mt-24 overflow-hidden py-24 lg:py-32"
    >
      <AuroraField className="opacity-70" />

      <PageContainer>
        <SectionHeading
          eyebrow="القوالب"
          title="ثمانية تصاميم، تجربة واحدة فاخرة"
          lede="كل تصميم عالمٌ قائم بذاته — افتح أيّها لتعيش التجربة كما سيراها ضيوفك تمامًا."
        />

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TEMPLATE_OPTIONS.map((option, i) => (
            <motion.div
              key={option.value}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, ease: EASE, delay: (i % 4) * 0.08 }}
            >
              <Link
                href={`/demo?template=${option.value}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-primary/15 bg-white/70 p-7 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-[0_28px_60px_-30px_rgba(120,90,30,0.45)]"
              >
                <span className="font-serif text-3xl italic text-primary/50 transition-colors group-hover:text-primary">
                  {INDEX[i]}
                </span>
                <h3 className="mt-4 font-heading text-2xl text-foreground">
                  {option.label}
                </h3>
                <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {TEMPLATE_DESCRIPTIONS[option.value]}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm text-primary">
                  معاينة حيّة
                  <ArrowLeft
                    className="size-4 transition-transform group-hover:-translate-x-1"
                    strokeWidth={1.75}
                  />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </PageContainer>
    </section>
  );
}
