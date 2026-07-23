"use client";

import type { LucideIcon } from "lucide-react";
import {
  CalendarClock,
  LayoutTemplate,
  MapPin,
  MessageCircle,
  Palette,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";

import { PageContainer } from "@/components/common/page-container";
import { EASE, SectionHeading } from "./primitives";

const FEATURES: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: LayoutTemplate,
    title: "ثمانية تصاميم سينمائية",
    body: "من الخيط الذهبي إلى الوهج المتحرّك — كل تصميم تجربة كاملة، لا مجرد بطاقة ثابتة.",
  },
  {
    icon: MessageCircle,
    title: "مشاركة عبر واتساب",
    body: "رابط واحد أنيق يفتح الدعوة مباشرةً على هاتف كل ضيف، مع معاينة جميلة عند الإرسال.",
  },
  {
    icon: Users,
    title: "تتبّع الحضور لحظيًّا",
    body: "يؤكّد ضيوفك حضورهم بضغطة، وأنت تتابع القائمة وعدد المقاعد من لوحة واحدة.",
  },
  {
    icon: CalendarClock,
    title: "عدّاد تنازلي حيّ",
    body: "عدّاد يتحرّك حتى لحظة الزفاف، وزرّ لإضافة الموعد إلى تقويم الضيف بنقرة.",
  },
  {
    icon: MapPin,
    title: "الموقع والاتجاهات",
    body: "خريطة وموقع القاعة مدمجان في الدعوة، مع رابط اتجاهات يفتح خرائط جوجل فورًا.",
  },
  {
    icon: Palette,
    title: "أربع لوحات ألوان",
    body: "كلاسيكي، عصري، فاخر، ورومانسي — يرتدي أي تصميم أي لوحة دون أن يفقد رونقه.",
  },
];

/** The value grid — six cards that rise in and lift on hover. */
export function Features() {
  return (
    <section id="features" className="relative scroll-mt-24 py-24 lg:py-32">
      <PageContainer>
        <SectionHeading
          eyebrow="لماذا WeddingLeaf"
          title="كل ما تحتاجه دعوة لا تُنسى"
          lede="تفاصيل مصمّمة بعناية الحرفيّ، وتقنية تجعل كل خطوة سهلة — من الإنشاء حتى آخر تأكيد حضور."
        />

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <motion.article
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: EASE, delay: (i % 3) * 0.1 }}
              className="group relative overflow-hidden rounded-3xl border border-primary/12 bg-white/60 p-8 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/35 hover:shadow-[0_28px_60px_-30px_rgba(120,90,30,0.4)]"
            >
              {/* sheen that sweeps on hover */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -inset-x-10 -top-16 h-32 rotate-12 bg-gradient-to-b from-primary/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
              <span className="relative grid size-13 place-items-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary ring-1 ring-inset ring-primary/20">
                <feature.icon className="size-6" strokeWidth={1.5} />
              </span>
              <h3 className="mt-6 font-heading text-2xl text-foreground">
                {feature.title}
              </h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {feature.body}
              </p>
            </motion.article>
          ))}
        </div>
      </PageContainer>
    </section>
  );
}
