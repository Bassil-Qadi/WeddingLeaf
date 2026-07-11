import { z } from "zod";

export const scheduleItemSchema = z.object({
  time: z.string().min(1, { message: "الوقت مطلوب" }),
  title: z.string().min(1, { message: "عنوان الفقرة مطلوب" }),
});

export const createEventSchema = z.object({
  slug: z
    .string()
    .min(3, { message: "الرابط يجب أن يكون 3 أحرف على الأقل" })
    .regex(/^[a-z0-9-]+$/, {
      message: "الرابط يجب أن يحتوي على أحرف إنجليزية صغيرة وأرقام وشرطات فقط",
    }),
  style: z.enum([
    "jordanian",
    "gulf",
    "palestinian",
    "lebanese",
    "egyptian",
  ]),
  groomName: z.string().min(2, { message: "اسم العريس مطلوب" }),
  brideName: z.string().min(2, { message: "اسم العروس مطلوب" }),
  date: z.string().min(1, { message: "تاريخ الحفل مطلوب" }), // ISO date string from <input type="date">
  dateDisplay: z.string().min(1, { message: "صيغة عرض التاريخ مطلوبة" }),
  city: z.string().min(2, { message: "المدينة مطلوبة" }),
  venueName: z.string().min(2, { message: "اسم القاعة مطلوب" }),
  venueAddress: z.string().min(2, { message: "عنوان القاعة مطلوب" }),
  mapUrl: z.string().url({ message: "رابط خرائط جوجل غير صالح" }),
  dressCode: z.string().optional(),
  schedule: z.array(scheduleItemSchema),
  message: z.string().optional(),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;

export const updateEventSchema = createEventSchema
  .partial()
  .extend({ isPublished: z.boolean().optional() });

export type UpdateEventInput = z.infer<typeof updateEventSchema>;