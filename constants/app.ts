import { defaultLocale, locales } from "@/lib/i18n";

export const APP = {
  name: "WeddingLeaf",

  description:
    "Create unforgettable digital wedding invitations.",

  defaultLocale,

  supportedLocales: locales,
} as const;