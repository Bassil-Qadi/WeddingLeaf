import { z } from "zod";

/**
 * How many open-link responses an event accepts before it stops taking them.
 *
 * The open RSVP endpoint is public and unauthenticated by design — that is what
 * "open" means — and it *creates* a guest row. Without a ceiling, anyone who
 * knows a published slug can script a loop and append rows forever, poisoning
 * the single number the couple is paying us for. Rate limiting slows that down;
 * only a cap bounds it.
 *
 * 300 sits above a realistic open-link wedding and well below the point where
 * the damage gets interesting. A couple expecting more than that should be
 * naming their guests, which is the path that has tokens.
 *
 * It lives here rather than beside the schema in `models/Event` because the
 * event form needs it too, and that is a client component — importing the model
 * would pull mongoose into the browser bundle.
 */
export const DEFAULT_OPEN_RSVP_LIMIT = 300;

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
  openRsvpLimit: z.number().int().min(0).max(2000).optional(),
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
