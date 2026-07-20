import { Types } from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { Event } from "@/models/Event";
import { Guest } from "@/models/Guest";
import {
  DEFAULT_TIME_ZONE,
  formatArabicDate,
  toDateInputValue,
  toTimeInputValue,
  zonedToUtc,
} from "@/lib/date";
import {
  DEFAULT_OPEN_RSVP_LIMIT,
  type CreateEventInput,
  type UpdateEventInput,
} from "@/lib/validations/event";
import type {
  WeddingStyle,
  WeddingTheme,
  WeddingTemplate,
} from "@/types/invitation";
import { normalizeTheme } from "@/lib/wedding-themes";
import { normalizeTemplate } from "@/lib/wedding-templates";
import { deleteEventImage } from "@/lib/storage";

export interface EventSummary {
  id: string;
  slug: string;
  style: WeddingStyle;
  groomName: string;
  brideName: string;
  /** Derived from `date` + `style` + `timeZone`; never stored. */
  dateDisplay: string;
  city: string;
  venueName: string;
  isPublished: boolean;
  coverImageUrl: string | null;
  updatedAt: string;
}

export interface EventDetail extends EventSummary {
  ownerId: string;
  theme: WeddingTheme;
  template: WeddingTemplate;
  /** Local wall-clock halves, for the `<input type="date">` / `type="time">`. */
  date: string;
  time: string;
  timeZone: string;
  venueAddress: string;
  mapUrl: string;
  dressCode?: string;
  schedule: { time: string; title: string }[];
  galleryImages: string[];
  couplePhotoUrl: string | null;
  venuePhotoUrl: string | null;
  message?: string;
  story?: string;
  hashtag?: string;
  rsvpPhone?: string;
  rsvpEnabled: boolean;
  rsvpDeadline: string | null;
  allowOpenRsvp: boolean;
  maxPartySize: number;
  openRsvpLimit: number;
}

interface EventLeanDoc {
  _id: Types.ObjectId;
  ownerId: Types.ObjectId;
  slug: string;
  style: WeddingStyle;
  /** Absent on events written before the visual-theme field existed. */
  theme?: WeddingTheme;
  /** Absent on events written before the layout field existed. */
  template?: WeddingTemplate;
  groomName: string;
  brideName: string;
  date: Date;
  /** Absent on events written before the field existed — see DEFAULT_TIME_ZONE. */
  timeZone?: string;
  city: string;
  venueName: string;
  venueAddress: string;
  mapUrl: string;
  dressCode?: string | null;
  schedule?: { time: string; title: string }[];
  coverImageUrl?: string | null;
  galleryImages?: string[];
  couplePhotoUrl?: string | null;
  venuePhotoUrl?: string | null;
  message?: string | null;
  story?: string | null;
  hashtag?: string | null;
  rsvpPhone?: string | null;
  rsvpEnabled?: boolean;
  rsvpDeadline?: Date | null;
  allowOpenRsvp?: boolean;
  maxPartySize?: number;
  /** Absent on events written before the field existed. */
  openRsvpLimit?: number;
  isPublished: boolean;
  updatedAt: Date;
}

function toSummary(doc: EventLeanDoc): EventSummary {
  const timeZone = doc.timeZone ?? DEFAULT_TIME_ZONE;

  return {
    id: doc._id.toString(),
    slug: doc.slug,
    style: doc.style,
    groomName: doc.groomName,
    brideName: doc.brideName,
    dateDisplay: formatArabicDate(new Date(doc.date), doc.style, timeZone),
    city: doc.city,
    venueName: doc.venueName,
    isPublished: doc.isPublished,
    coverImageUrl: doc.coverImageUrl ?? null,
    updatedAt: new Date(doc.updatedAt).toISOString(),
  };
}

function toDetail(doc: EventLeanDoc): EventDetail {
  const instant = new Date(doc.date);
  const timeZone = doc.timeZone ?? DEFAULT_TIME_ZONE;

  return {
    ...toSummary(doc),
    ownerId: doc.ownerId.toString(),
    theme: normalizeTheme(doc.theme),
    template: normalizeTemplate(doc.template),
    date: toDateInputValue(instant, timeZone),
    time: toTimeInputValue(instant, timeZone),
    timeZone,
    venueAddress: doc.venueAddress,
    mapUrl: doc.mapUrl,
    dressCode: doc.dressCode ?? undefined,
    schedule: (doc.schedule ?? []).map((s) => ({
      time: s.time,
      title: s.title,
    })),
    galleryImages: doc.galleryImages ?? [],
    couplePhotoUrl: doc.couplePhotoUrl ?? null,
    venuePhotoUrl: doc.venuePhotoUrl ?? null,
    message: doc.message ?? undefined,
    story: doc.story ?? undefined,
    hashtag: doc.hashtag ?? undefined,
    rsvpPhone: doc.rsvpPhone ?? undefined,
    rsvpEnabled: doc.rsvpEnabled ?? true,
    rsvpDeadline: doc.rsvpDeadline
      ? new Date(doc.rsvpDeadline).toISOString().slice(0, 10)
      : null,
    allowOpenRsvp: doc.allowOpenRsvp ?? true,
    maxPartySize: doc.maxPartySize ?? 4,
    openRsvpLimit: doc.openRsvpLimit ?? DEFAULT_OPEN_RSVP_LIMIT,
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

/**
 * Strip the three wall-clock fields off an update and fold them back into the
 * single `date` instant. They are only meaningful together, so a patch that
 * touches any of them is resolved against what is already stored.
 */
function toStoredFields(
  input: Partial<CreateEventInput>,
  current?: { date: Date; timeZone: string },
): Record<string, unknown> {
  const { date, time, timeZone, rsvpDeadline, ...rest } =
    input as Partial<CreateEventInput>;

  const update: Record<string, unknown> = { ...rest };

  if (rsvpDeadline !== undefined) {
    update.rsvpDeadline = rsvpDeadline ? new Date(rsvpDeadline) : null;
  }

  if (date === undefined && time === undefined && timeZone === undefined) {
    return update;
  }

  const zone =
    timeZone ?? current?.timeZone ?? "Asia/Amman";
  const day =
    date ??
    (current ? toDateInputValue(current.date, zone) : undefined);
  const hour =
    time ??
    (current ? toTimeInputValue(current.date, zone) : undefined);

  if (!day || !hour) return update;

  update.timeZone = zone;
  update.date = zonedToUtc(day, hour, zone);

  return update;
}

export async function createEvent(
  ownerId: string,
  input: CreateEventInput,
): Promise<EventDetail> {
  await connectToDatabase();

  const doc = await Event.create({
    ...toStoredFields(input),
    ownerId,
  });

  return toDetail(doc.toObject());
}

export async function updateEvent(
  id: string,
  ownerId: string,
  input: UpdateEventInput,
): Promise<EventDetail | null> {
  if (!Types.ObjectId.isValid(id)) return null;

  await connectToDatabase();

  const current = await Event.findOne({ _id: id, ownerId })
    .select("date timeZone coverImageUrl galleryImages")
    .lean();
  if (!current) return null;

  const imagesBefore = collectImageUrls(current);

  const update = toStoredFields(input, {
    date: new Date(current.date),
    timeZone: current.timeZone ?? DEFAULT_TIME_ZONE,
  });

  if (Object.keys(update).length === 0) {
    return getEventForOwner(id, ownerId);
  }

  const doc = await Event.findOneAndUpdate(
    { _id: id, ownerId },
    { $set: update },
    { new: true },
  ).lean();

  if (!doc) return null;

  await deleteOrphanedImages(imagesBefore, collectImageUrls(doc), ownerId);

  return toDetail(doc);
}

/** Every image URL an event document currently points at. */
function collectImageUrls(doc: {
  coverImageUrl?: string | null;
  galleryImages?: string[] | null;
}): string[] {
  return [doc.coverImageUrl, ...(doc.galleryImages ?? [])].filter(
    (url): url is string => typeof url === "string" && url.length > 0,
  );
}

/**
 * Drops the files an edit just orphaned. Storage is metered, so an image the
 * couple removed from their gallery must stop costing them — the URL leaving
 * the document is the only signal that happens.
 *
 * Compares against the *saved* document rather than the request body so it is
 * correct however the edit arrived, and never deletes a URL still referenced
 * (a cover promoted out of the gallery, say). Failures are swallowed inside
 * `deleteEventImage`: a stranded file is a cost problem, but a failed edit is
 * a user problem, and the user's edit already succeeded by this point.
 */
async function deleteOrphanedImages(
  before: string[],
  after: string[],
  ownerId: string,
): Promise<void> {
  const kept = new Set(after);
  const orphaned = before.filter((url) => !kept.has(url));
  if (orphaned.length === 0) return;

  await Promise.allSettled(
    orphaned.map((url) => deleteEventImage(url, ownerId)),
  );
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
  if (result.deletedCount !== 1) return false;

  // The guest list belongs to the wedding, not to the couple's account.
  await Guest.deleteMany({ eventId: id });

  return true;
}
