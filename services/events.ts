import { Types } from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { Event } from "@/models/Event";
import type { CreateEventInput } from "@/lib/validations/event";
import type { WeddingStyle } from "@/types/invitation";

export interface EventSummary {
  id: string;
  slug: string;
  style: WeddingStyle;
  groomName: string;
  brideName: string;
  dateDisplay: string;
  city: string;
  venueName: string;
  isPublished: boolean;
  coverImageUrl: string | null;
  updatedAt: string;
}

export interface EventDetail extends EventSummary {
  ownerId: string;
  date: string; // ISO, for the <input type="date">
  venueAddress: string;
  mapUrl: string;
  dressCode?: string;
  schedule: { time: string; title: string }[];
  galleryImages: string[];
  message?: string;
}

interface EventLeanDoc {
  _id: Types.ObjectId;
  ownerId: Types.ObjectId;
  slug: string;
  style: WeddingStyle;
  groomName: string;
  brideName: string;
  date: Date;
  dateDisplay: string;
  city: string;
  venueName: string;
  venueAddress: string;
  mapUrl: string;
  dressCode?: string | null;
  schedule?: { time: string; title: string }[];
  coverImageUrl?: string | null;
  galleryImages?: string[];
  message?: string | null;
  isPublished: boolean;
  updatedAt: Date;
}

function toSummary(doc: EventLeanDoc): EventSummary {
  return {
    id: doc._id.toString(),
    slug: doc.slug,
    style: doc.style,
    groomName: doc.groomName,
    brideName: doc.brideName,
    dateDisplay: doc.dateDisplay,
    city: doc.city,
    venueName: doc.venueName,
    isPublished: doc.isPublished,
    coverImageUrl: doc.coverImageUrl ?? null,
    updatedAt: new Date(doc.updatedAt).toISOString(),
  };
}

function toDetail(doc: EventLeanDoc): EventDetail {
  return {
    ...toSummary(doc),
    ownerId: doc.ownerId.toString(),
    date: new Date(doc.date).toISOString().slice(0, 10),
    venueAddress: doc.venueAddress,
    mapUrl: doc.mapUrl,
    dressCode: doc.dressCode ?? undefined,
    schedule: (doc.schedule ?? []).map((s) => ({
      time: s.time,
      title: s.title,
    })),
    galleryImages: doc.galleryImages ?? [],
    message: doc.message ?? undefined,
  };
}

export async function listEventsByOwner(
  ownerId: string,
): Promise<EventSummary[]> {
  await connectToDatabase();

  const docs = await Event.find({ ownerId })
    .sort({ updatedAt: -1 })
    .lean();

  return docs.map(toSummary);
}

export async function getEventForOwner(
  id: string,
  ownerId: string,
): Promise<EventDetail | null> {
  if (!Types.ObjectId.isValid(id)) return null;

  await connectToDatabase();

  const doc = await Event.findOne({ _id: id, ownerId }).lean();
  if (!doc) return null;

  return toDetail(doc);
}

export async function isSlugTaken(
  slug: string,
  excludeId?: string,
): Promise<boolean> {
  await connectToDatabase();

  const existing = await Event.findOne({
    slug: slug.toLowerCase(),
    ...(excludeId ? { _id: { $ne: excludeId } } : {}),
  })
    .select("_id")
    .lean();

  return Boolean(existing);
}

export async function createEvent(
  ownerId: string,
  input: CreateEventInput,
): Promise<EventDetail> {
  await connectToDatabase();

  const doc = await Event.create({
    ...input,
    ownerId,
    date: new Date(input.date),
  });

  return toDetail(doc.toObject());
}

export async function updateEvent(
  id: string,
  ownerId: string,
  input: Partial<CreateEventInput> & { isPublished?: boolean },
): Promise<EventDetail | null> {
  if (!Types.ObjectId.isValid(id)) return null;

  await connectToDatabase();

  const update: Record<string, unknown> = { ...input };
  if (input.date) {
    update.date = new Date(input.date);
  }

  const doc = await Event.findOneAndUpdate(
    { _id: id, ownerId },
    { $set: update },
    { new: true },
  ).lean();

  if (!doc) return null;

  return toDetail(doc);
}

export async function setEventImages(
  id: string,
  ownerId: string,
  images: { coverImageUrl?: string; galleryImages?: string[] },
): Promise<EventDetail | null> {
  if (!Types.ObjectId.isValid(id)) return null;

  await connectToDatabase();

  const doc = await Event.findOneAndUpdate(
    { _id: id, ownerId },
    { $set: images },
    { new: true },
  ).lean();

  if (!doc) return null;

  return toDetail(doc);
}

export async function setEventPublished(
  id: string,
  ownerId: string,
  isPublished: boolean,
): Promise<EventDetail | null> {
  if (!Types.ObjectId.isValid(id)) return null;

  await connectToDatabase();

  const doc = await Event.findOneAndUpdate(
    { _id: id, ownerId },
    { $set: { isPublished } },
    { new: true },
  ).lean();

  if (!doc) return null;

  return toDetail(doc);
}

export async function deleteEvent(
  id: string,
  ownerId: string,
): Promise<boolean> {
  if (!Types.ObjectId.isValid(id)) return false;

  await connectToDatabase();

  const result = await Event.deleteOne({ _id: id, ownerId });
  return result.deletedCount === 1;
}
