import { randomBytes } from "node:crypto";
import { Types } from "mongoose";

import { connectToDatabase } from "@/lib/mongodb";
import { Event } from "@/models/Event";
import { Guest } from "@/models/Guest";
import type { GuestInput, RsvpInput, UpdateGuestInput } from "@/lib/validations/guest";

export type GuestStatus = "pending" | "attending" | "declined";

export interface GuestRecord {
  id: string;
  name: string;
  phone: string | null;
  seats: number;
  token: string | null;
  status: GuestStatus;
  partySize: number;
  note: string | null;
  respondedAt: string | null;
  openedAt: string | null;
  sentAt: string | null;
  source: "list" | "open";
  createdAt: string;
}

export interface GuestStats {
  invited: number;
  /** Seats set aside across the whole list, before anyone has answered. */
  seatsAllocated: number;
  attending: number;
  declined: number;
  pending: number;
  opened: number;
  /** The number the venue bills against. */
  confirmedSeats: number;
}

interface GuestLeanDoc {
  _id: Types.ObjectId;
  name: string;
  phone?: string | null;
  seats?: number;
  token?: string | null;
  status?: GuestStatus;
  partySize?: number;
  note?: string | null;
  respondedAt?: Date | null;
  openedAt?: Date | null;
  sentAt?: Date | null;
  source?: "list" | "open";
  createdAt: Date;
}

function toRecord(doc: GuestLeanDoc): GuestRecord {
  return {
    id: doc._id.toString(),
    name: doc.name,
    phone: doc.phone ?? null,
    seats: doc.seats ?? 1,
    token: doc.token ?? null,
    status: doc.status ?? "pending",
    partySize: doc.partySize ?? 0,
    note: doc.note ?? null,
    respondedAt: doc.respondedAt
      ? new Date(doc.respondedAt).toISOString()
      : null,
    openedAt: doc.openedAt ? new Date(doc.openedAt).toISOString() : null,
    sentAt: doc.sentAt ? new Date(doc.sentAt).toISOString() : null,
    source: doc.source ?? "list",
    createdAt: new Date(doc.createdAt).toISOString(),
  };
}

/**
 * Short, URL-safe, and unguessable enough that a stranger cannot walk the
 * guest list of a wedding by trying tokens — 10 bytes of base64url is ~64 bits,
 * against a list that is only ever hundreds of rows long.
 */
function generateToken(): string {
  return randomBytes(10).toString("base64url");
}

/** Resolves an event id only if this owner actually owns it. */
async function assertOwnedEvent(
  eventId: string,
  ownerId: string,
): Promise<boolean> {
  if (!Types.ObjectId.isValid(eventId)) return false;

  const event = await Event.findOne({ _id: eventId, ownerId })
    .select("_id")
    .lean();

  return Boolean(event);
}

export async function listGuests(
  eventId: string,
  ownerId: string,
): Promise<GuestRecord[] | null> {
  await connectToDatabase();

  if (!(await assertOwnedEvent(eventId, ownerId))) return null;

  const docs = await Guest.find({ eventId })
    .sort({ createdAt: -1 })
    .lean();

  return docs.map(toRecord);
}

export async function getGuestStats(
  eventId: string,
  ownerId: string,
): Promise<GuestStats | null> {
  await connectToDatabase();

  if (!(await assertOwnedEvent(eventId, ownerId))) return null;

  const [stats] = await Guest.aggregate<Omit<GuestStats, never>>([
    { $match: { eventId: new Types.ObjectId(eventId) } },
    {
      $group: {
        _id: null,
        invited: { $sum: 1 },
        seatsAllocated: { $sum: { $ifNull: ["$seats", 1] } },
        attending: {
          $sum: { $cond: [{ $eq: ["$status", "attending"] }, 1, 0] },
        },
        declined: {
          $sum: { $cond: [{ $eq: ["$status", "declined"] }, 1, 0] },
        },
        pending: {
          $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
        },
        opened: {
          $sum: { $cond: [{ $ifNull: ["$openedAt", false] }, 1, 0] },
        },
        confirmedSeats: {
          $sum: {
            $cond: [
              { $eq: ["$status", "attending"] },
              { $ifNull: ["$partySize", 0] },
              0,
            ],
          },
        },
      },
    },
    { $project: { _id: 0 } },
  ]);

  return (
    stats ?? {
      invited: 0,
      seatsAllocated: 0,
      attending: 0,
      declined: 0,
      pending: 0,
      opened: 0,
      confirmedSeats: 0,
    }
  );
}

export async function addGuests(
  eventId: string,
  ownerId: string,
  guests: GuestInput[],
): Promise<GuestRecord[] | null> {
  await connectToDatabase();

  if (!(await assertOwnedEvent(eventId, ownerId))) return null;

  const docs = await Guest.insertMany(
    guests.map((guest) => ({
      eventId,
      name: guest.name,
      phone: guest.phone ?? null,
      seats: guest.seats,
      token: generateToken(),
      source: "list" as const,
    })),
  );

  return docs.map((doc) => toRecord(doc.toObject()));
}

export async function updateGuest(
  eventId: string,
  ownerId: string,
  guestId: string,
  input: UpdateGuestInput,
): Promise<GuestRecord | null> {
  await connectToDatabase();

  if (!Types.ObjectId.isValid(guestId)) return null;
  if (!(await assertOwnedEvent(eventId, ownerId))) return null;

  const doc = await Guest.findOneAndUpdate(
    { _id: guestId, eventId },
    { $set: input },
    { new: true },
  ).lean();

  return doc ? toRecord(doc) : null;
}

export async function deleteGuest(
  eventId: string,
  ownerId: string,
  guestId: string,
): Promise<boolean> {
  await connectToDatabase();

  if (!Types.ObjectId.isValid(guestId)) return false;
  if (!(await assertOwnedEvent(eventId, ownerId))) return false;

  const result = await Guest.deleteOne({ _id: guestId, eventId });
  return result.deletedCount === 1;
}

/** Called when the event itself is deleted — a guest without a wedding is litter. */
export async function deleteGuestsForEvent(eventId: string): Promise<void> {
  await connectToDatabase();
  await Guest.deleteMany({ eventId });
}

/**
 * The guest behind a personal invitation link. Scoped by event as well as
 * token so a token from one wedding cannot address a guest at another.
 */
export async function getGuestByToken(
  eventId: string,
  token: string,
): Promise<GuestRecord | null> {
  await connectToDatabase();

  const doc = await Guest.findOne({ eventId, token }).lean();
  return doc ? toRecord(doc) : null;
}

/** First open only — later visits shouldn't overwrite when they first saw it. */
export async function markGuestOpened(
  eventId: string,
  token: string,
): Promise<void> {
  await connectToDatabase();

  await Guest.updateOne(
    { eventId, token, openedAt: null },
    { $set: { openedAt: new Date() } },
  );
}

export async function markGuestsSent(
  eventId: string,
  ownerId: string,
  guestIds: string[],
): Promise<number> {
  await connectToDatabase();

  if (!(await assertOwnedEvent(eventId, ownerId))) return 0;

  const result = await Guest.updateMany(
    { eventId, _id: { $in: guestIds.filter(Types.ObjectId.isValid) } },
    { $set: { sentAt: new Date() } },
  );

  return result.modifiedCount;
}

export type RsvpResult =
  | { ok: true; guest: GuestRecord }
  | { ok: false; reason: "closed" | "not-found" | "over-capacity" };

/**
 * Record a guest's answer.
 *
 * A token identifies an invited guest and updates their row in place, so a
 * couple changing their mind twice still leaves one line in the list. Without
 * a token the responder came in on the open link and a new row is appended,
 * marked `source: "open"` so the couple can see it wasn't someone they named.
 *
 * The seat cap is enforced here rather than in the stepper, because the
 * stepper is client-side and the endpoint is public.
 */
export async function submitRsvp(
  eventId: string,
  input: RsvpInput,
): Promise<RsvpResult> {
  await connectToDatabase();

  const event = await Event.findById(eventId)
    .select("rsvpEnabled rsvpDeadline allowOpenRsvp maxPartySize isPublished")
    .lean();

  if (!event || !event.isPublished || event.rsvpEnabled === false) {
    return { ok: false, reason: "closed" };
  }

  if (event.rsvpDeadline && new Date() > new Date(event.rsvpDeadline)) {
    return { ok: false, reason: "closed" };
  }

  const partySize = input.status === "attending" ? input.partySize : 0;

  if (input.token) {
    const guest = await Guest.findOne({ eventId, token: input.token });
    if (!guest) return { ok: false, reason: "not-found" };

    if (partySize > (guest.seats ?? 1)) {
      return { ok: false, reason: "over-capacity" };
    }

    guest.set({
      status: input.status,
      partySize,
      note: input.note ?? null,
      respondedAt: new Date(),
    });
    await guest.save();

    return { ok: true, guest: toRecord(guest.toObject()) };
  }

  if (event.allowOpenRsvp === false) {
    return { ok: false, reason: "closed" };
  }

  const maxPartySize = event.maxPartySize ?? 4;
  if (partySize > maxPartySize) {
    return { ok: false, reason: "over-capacity" };
  }

  if (!input.name) {
    return { ok: false, reason: "not-found" };
  }

  const doc = await Guest.create({
    eventId,
    name: input.name,
    phone: input.phone ?? null,
    seats: Math.max(partySize, 1),
    token: null,
    status: input.status,
    partySize,
    note: input.note ?? null,
    respondedAt: new Date(),
    openedAt: new Date(),
    source: "open",
  });

  return { ok: true, guest: toRecord(doc.toObject()) };
}
