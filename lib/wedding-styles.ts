import type { WeddingStyle } from "@/types/invitation";

export const STYLE_LABELS: Record<WeddingStyle, string> = {
  jordanian: "أردني",
  gulf: "خليجي",
  palestinian: "فلسطيني",
  lebanese: "لبناني",
  egyptian: "مصري",
};

export const STYLE_OPTIONS: { value: WeddingStyle; label: string }[] =
  Object.entries(STYLE_LABELS).map(([value, label]) => ({
    value: value as WeddingStyle,
    label,
  }));
