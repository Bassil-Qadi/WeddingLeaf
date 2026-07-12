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
 * Guests the couple typed in have `source: "list"` and a `token` that
 * addresses their personal invitation at /i/<slug>/<token>. Guests who found
 * the open link and answered on it have `source: "open"` and no token — they
 * still land in the same table so the headcount stays whole.
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

    /** Addresses the personal invitation. Absent for open-link responders. */
    token: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
      default: null,
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
