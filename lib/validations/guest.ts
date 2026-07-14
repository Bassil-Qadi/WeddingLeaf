import { z } from "zod";

export const guestSchema = z.object({
  name: z.string().min(2, { message: "اسم الضيف مطلوب" }),
  phone: z
    .string()
    .regex(/^\+?[0-9\s-]{7,20}$/, { message: "رقم الهاتف غير صالح" })
    .nullable()
    .optional(),
  seats: z
    .number()
    .int()
    .min(1, { message: "عدد المقاعد لا يقل عن ١" })
    .max(20, { message: "عدد المقاعد لا يزيد عن ٢٠" })
    .default(1),
});

export type GuestInput = z.infer<typeof guestSchema>;

/** Adding guests one at a time, or a whole pasted list at once. */
export const createGuestsSchema = z.object({
  guests: z
    .array(guestSchema)
    .min(1, { message: "أضف ضيفًا واحدًا على الأقل" })
    .max(500, { message: "يمكن إضافة ٥٠٠ ضيف كحد أقصى في المرة الواحدة" }),
});

export const updateGuestSchema = guestSchema.partial();

export type UpdateGuestInput = z.infer<typeof updateGuestSchema>;

/**
 * Marking a batch of invitations sent, or un-marking them. The queue sends one
 * guest at a time, but "تحديد الكل كمُرسلة" is a whole list at once — hence the
 * ceiling, which matches the one on adding guests.
 */
export const setSentSchema = z.object({
  guestIds: z
    .array(z.string())
    .min(1, { message: "اختر ضيفًا واحدًا على الأقل" })
    .max(500),
  sent: z.boolean(),
});

export type SetSentInput = z.infer<typeof setSentSchema>;

/**
 * A guest's own answer, submitted from the invitation.
 *
 * `partySize` is only meaningful when attending, and is checked against the
 * guest's seat allowance server-side — the stepper's cap is a courtesy, not a
 * control.
 */
export const rsvpSchema = z.object({
  token: z.string().optional(),
  // Open-link responders introduce themselves; named guests are already known.
  name: z.string().min(2, { message: "الاسم مطلوب" }).optional(),
  phone: z
    .string()
    .regex(/^\+?[0-9\s-]{7,20}$/, { message: "رقم الهاتف غير صالح" })
    .optional(),
  status: z.enum(["attending", "declined"], {
    message: "اختر الحضور أو الاعتذار",
  }),
  partySize: z.number().int().min(0).max(20).default(1),
  note: z.string().max(300, { message: "الرسالة طويلة جدًا" }).optional(),
});

export type RsvpInput = z.infer<typeof rsvpSchema>;

/**
 * "أحمد الخطيب, 0791234567, 2" per line — the shape of a list pasted straight
 * out of a phone's contacts or a spreadsheet column. Name is the only required
 * column; seats defaults to one. Blank lines and stray separators are dropped
 * rather than rejected, because a paste that fails on line 84 of 200 is worse
 * than one that quietly does the sensible thing.
 */
export function parseGuestList(raw: string): GuestInput[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, phone, seats] = line
        .split(/[,\t;]/)
        .map((cell) => cell.trim());

      const parsedSeats = Number(seats);

      return {
        name: name ?? "",
        phone: phone || null,
        seats:
          Number.isInteger(parsedSeats) && parsedSeats >= 1 && parsedSeats <= 20
            ? parsedSeats
            : 1,
      };
    })
    .filter((guest) => guest.name.length >= 2);
}
