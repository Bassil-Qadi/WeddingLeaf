import { defaultLocale, locales } from "@/lib/i18n";

export const APP = {
  name: "WeddingLeaf",

  tagline: "دعوة زفاف تبقى في الذاكرة",

  description:
    "منصة عربية لإنشاء دعوات زفاف رقمية فاخرة، ومشاركتها عبر واتساب، وتتبع الحضور بسهولة.",

  defaultLocale,

  supportedLocales: locales,
} as const;