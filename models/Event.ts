import {
    Schema,
    model,
    models,
    type InferSchemaType,
    type Model,
  } from "mongoose";

  import { DEFAULT_OPEN_RSVP_LIMIT } from "@/lib/validations/event";

  const ScheduleItemSchema = new Schema(
    {
      time: { type: String, required: true },
      title: { type: String, required: true },
    },
    { _id: false },
  );

  const EventSchema = new Schema(
    {
      ownerId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },

      // Public URL slug -> yourapp.com/i/<slug>
      slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: /^[a-z0-9-]+$/,
      },

      // The regional axis — Arabic month names + default timezone (see lib/date).
      style: {
        type: String,
        enum: ["jordanian", "gulf", "palestinian", "lebanese", "egyptian"],
        default: "jordanian",
      },

      // The visual axis — palette/mood only (see the .gt[data-theme] blocks in
      // globals.css). Independent of `style`: any region can wear any theme.
      theme: {
        type: String,
        enum: ["classic", "modern", "opulent", "romantic"],
        default: "classic",
      },

      // The layout axis — which whole invitation experience renders (structure
      // and motion, not colour). Independent of `theme`: any layout wears any
      // palette. The dispatcher is in invitation-experience.tsx.
      template: {
        type: String,
        enum: ["thread", "card"],
        default: "thread",
      },

      groomName: { type: String, required: true, trim: true },
      brideName: { type: String, required: true, trim: true },

      // The exact instant the ceremony begins. Built from the couple's local
      // date + time in `timeZone` (see lib/date.ts) so the countdown targets
      // the real moment rather than midnight UTC. Everything the invitation
      // prints about the date — the Arabic display string, the weekday, the
      // spelled-out hour — is derived from these two fields at read time and
      // is deliberately not stored: a denormalized copy is a copy that drifts.
      date: { type: Date, required: true },
      timeZone: { type: String, required: true, default: "Asia/Amman" },

      city: { type: String, required: true, trim: true },
      venueName: { type: String, required: true, trim: true },
      venueAddress: { type: String, required: true, trim: true },
      mapUrl: { type: String, required: true, trim: true },

      dressCode: { type: String, trim: true },
      schedule: { type: [ScheduleItemSchema], default: [] },

      coverImageUrl: { type: String, default: null },
      galleryImages: { type: [String], default: [] },
      // Chapter 01 (the couple) and chapter 04 (the venue) each want a photo of
      // their own; both fall back to the cover / gallery when unset.
      couplePhotoUrl: { type: String, default: null },
      venuePhotoUrl: { type: String, default: null },

      message: { type: String, trim: true },
      // The "قصتنا" paragraph. Without it every invitation renders the same
      // stock story, which is exactly what two customers comparing links notice.
      story: { type: String, trim: true },
      hashtag: { type: String, trim: true },
      rsvpPhone: { type: String, trim: true },

      // --- RSVP ---
      rsvpEnabled: { type: Boolean, default: true },
      // After this instant the RSVP chapter goes read-only.
      rsvpDeadline: { type: Date, default: null },
      // Whether someone who opens the plain /i/<slug> link (rather than a
      // personal /i/<slug>/<token> one) may respond. Couples who only send
      // named invitations turn this off so the guest list stays closed.
      allowOpenRsvp: { type: Boolean, default: true },
      // Ceiling for the party-size stepper on open RSVPs. Named guests are
      // capped by their own `seats` allowance instead.
      maxPartySize: { type: Number, default: 4, min: 1, max: 20 },
      // How many open-link rows this event will accept in total — see
      // DEFAULT_OPEN_RSVP_LIMIT above. Named guests don't count against it:
      // they already exist, so answering only updates a row.
      openRsvpLimit: {
        type: Number,
        default: DEFAULT_OPEN_RSVP_LIMIT,
        min: 0,
        max: 2000,
      },

      // Draft events aren't publicly reachable at /i/[slug] yet.
      isPublished: { type: Boolean, default: false },
    },
    { timestamps: true },
  );

  export type EventDocument = InferSchemaType<typeof EventSchema>;

  export const Event: Model<EventDocument> =
    models.Event || model<EventDocument>("Event", EventSchema);

  export default Event;
