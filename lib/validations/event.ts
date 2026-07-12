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

  // Local wall-clock date + time in `timeZone`; combined into the true UTC
  // instant on save. The Arabic display strings are derived from it, never
  // typed by hand.
  date: z.string().min(1, { message: "تاريخ الحفل مطلوب" }),
  time: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, { message: "وقت الحفل مطلوب" }),
  timeZone: z.string().min(1, { message: "المنطقة الزمنية مطلوبة" }),

  city: z.string().min(2, { message: "المدينة مطلوبة" }),
  venueName: z.string().min(2, { message: "اسم القاعة مطلوب" }),
  venueAddress: z.string().min(2, { message: "عنوان القاعة مطلوب" }),
  mapUrl: z.string().url({ message: "رابط خرائط جوجل غير صالح" }),
  dressCode: z.string().optional(),
  schedule: z.array(scheduleItemSchema),

  message: z.string().optional(),
  story: z
    .string()
    .max(600, { message: "القصة طويلة جدًا" })
    .optional(),
  hashtag: z.string().optional(),
  rsvpPhone: z.string().optional(),

  rsvpEnabled: z.boolean().optional(),
  rsvpDeadline: z.string().nullable().optional(),
  allowOpenRsvp: z.boolean().optional(),
  maxPartySize: z.number().int().min(1).max(20).optional(),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;

/**
 * Images are uploaded one at a time and PATCHed on their own, separately from
 * the main form — they have to be declared here or Zod strips them off the
 * update body and the upload silently does nothing.
 */
export const eventImagesSchema = z.object({
  coverImageUrl: z.string().url().nullable().optional(),
  galleryImages: z.array(z.string().url()).optional(),
  couplePhotoUrl: z.string().url().nullable().optional(),
  venuePhotoUrl: z.string().url().nullable().optional(),
});

export const updateEventSchema = createEventSchema
  .partial()
  .extend(eventImagesSchema.shape)
  .extend({ isPublished: z.boolean().optional() });

export type UpdateEventInput = z.infer<typeof updateEventSchema>;
