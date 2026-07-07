import {
    Schema,
    model,
    models,
    type InferSchemaType,
    type Model,
  } from "mongoose";
  
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
  
      style: {
        type: String,
        enum: ["jordanian", "gulf", "palestinian", "lebanese", "egyptian"],
        default: "jordanian",
      },
  
      groomName: { type: String, required: true, trim: true },
      brideName: { type: String, required: true, trim: true },
  
      date: { type: Date, required: true },
      dateDisplay: { type: String, required: true }, // Arabic-formatted display string
  
      city: { type: String, required: true, trim: true },
      venueName: { type: String, required: true, trim: true },
      venueAddress: { type: String, required: true, trim: true },
      mapUrl: { type: String, required: true, trim: true },
  
      dressCode: { type: String, trim: true },
      schedule: { type: [ScheduleItemSchema], default: [] },
  
      coverImageUrl: { type: String, default: null },
      galleryImages: { type: [String], default: [] },
  
      message: { type: String, trim: true },
  
      // Draft events aren't publicly reachable at /i/[slug] yet.
      isPublished: { type: Boolean, default: false },
    },
    { timestamps: true },
  );
  
  export type EventDocument = InferSchemaType<typeof EventSchema>;
  
  export const Event: Model<EventDocument> =
    models.Event || model<EventDocument>("Event", EventSchema);
  
  export default Event;