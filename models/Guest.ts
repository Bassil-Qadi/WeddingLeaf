import {
  Schema,
  model,
  models,
  type InferSchemaType,
  type Model,
} from "mongoose";

/**
 * One invited party — a person or a household — and their answer.
 *
 * The RSVP lives on the guest rather than in a collection of its own. A guest
 * has exactly one answer and may change it until the deadline, so a separate
 * response document would only ever be joined straight back onto this one, and
 * the number the couple actually cares about (confirmed seats, which is what
 * the venue bills against) is then a single sum over this collection.
 *
 * Guests the couple typed in have `source: "list"` and seats the couple granted
 * them. Guests who found the open link and answered on it have `source: "open"`
 * and are capped by the event's own ceiling instead — they still land in the
 * same table so the headcount stays whole. Both kinds carry a `token`; see the
 * field for why that is not optional.
 */
const GuestSchema = new Schema(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },

    name: { type: String, required: true, trim: true },
    // E.164 where we can get it — this is the WhatsApp send handle.
    phone: { type: String, trim: true, default: null },

    /**
     * How many people this invitation admits ("بطاقة لشخصين"). The party-size
     * stepper on the invitation is capped at this, and it is the number the
     * couple budgets against before anyone has answered.
     */
    seats: { type: Number, default: 1, min: 1, max: 20 },

    /**
     * Addresses this guest's invitation at /i/<slug>/<token>. Every guest has
     * one, including open-link responders, and it is `required` for a reason.
     *
     * The index is `sparse`, and a sparse index skips documents where the field
     * is *absent* — not where it is `null`. So a schema default of `null` would
     * put a literal null in a *unique* index, and the second guest to be written
     * without a token would collide with the first and blow up with a duplicate
     * key error. That is not hypothetical: it is the same defect that was found
     * in the `users` collection (a stale `id_1` index over an always-null field,
     * which had silently limited the entire database to one user), and it was
     * reproduced here — open-link RSVP worked exactly once, then 500'd forever.
     *
     * `required` is what closes it: there is now no way to write a guest without
     * a token, so no null ever reaches the index.
     */
    token: {
      type: String,
      required: true,
      unique: true,
      sparse: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["pending", "attending", "declined"],
      default: "pending",
      index: true,
    },
    /** Seats actually claimed. Meaningless unless `status` is "attending". */
    partySize: { type: Number, default: 0, min: 0, max: 20 },
    note: { type: String, trim: true, default: null },
    respondedAt: { type: Date, default: null },

    /** First time this guest opened their invitation — the top of the funnel. */
    openedAt: { type: Date, default: null },
    /** Set when the couple sends the link, so re-sends can skip the sent ones. */
    sentAt: { type: Date, default: null },

    source: {
      type: String,
      enum: ["list", "open"],
      default: "list",
    },
  },
  { timestamps: true },
);

// The guest table is always read one event at a time, newest first.
GuestSchema.index({ eventId: 1, createdAt: -1 });

export type GuestDocument = InferSchemaType<typeof GuestSchema>;

export const Guest: Model<GuestDocument> =
  models.Guest || model<GuestDocument>("Guest", GuestSchema);

export default Guest;
