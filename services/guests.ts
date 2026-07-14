import { randomBytes } from "node:crypto";
import { Types } from "mongoose";

import { connectToDatabase } from "@/lib/mongodb";
import { Event } from "@/models/Event";
import { Guest } from "@/models/Guest";
import { DEFAULT_OPEN_RSVP_LIMIT } from "@/lib/validations/event";
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

/**
 * Mark invitations as sent — or un-mark them.
 *
 * `sentAt` records that the couple *opened WhatsApp* for this guest, which is
 * the most we can honestly know: WhatsApp exposes no API, so the message is
 * composed for them and a human presses send. They might not have. The undo is
 * therefore not a nicety, it is the correction mechanism for the one failure
 * that actually hurts — a guest marked sent who was never invited at all.
 *
 * Unconditional `$set` rather than "first send wins": a couple re-sending a link
 * to someone who lost it should see today's date, not the date of the send that
 * evidently didn't land.
 */
export async function setGuestsSent(
  eventId: string,
  ownerId: string,
  guestIds: string[],
  sent: boolean,
): Promise<number | null> {
  await connectToDatabase();

  // `null` for "not yours", a count for "yours" — a bare 0 would conflate a
  // wrong event id with a no-op update, and the caller would report success.
  if (!(await assertOwnedEvent(eventId, ownerId))) return null;

  const ids = guestIds.filter((id) => Types.ObjectId.isValid(id));
  if (ids.length === 0) return 0;

  const result = await Guest.updateMany(
    { eventId, _id: { $in: ids } },
    { $set: { sentAt: sent ? new Date() : null } },
  );

  return result.modifiedCount;
}

export type RsvpResult =
  | { ok: true; guest: GuestRecord }
  | {
      ok: false;
      reason: "closed" | "not-found" | "over-capacity" | "open-limit";
    };

/**
 * Record a guest's answer.
 *
 * A token identifies an invited guest and updates their row in place, so a
 * couple changing their mind twice still leaves one line in the list. Without
 * a token the responder came in on the open link and a new row is appended,
 * marked `source: "open"` so the couple can see it wasn't someone they named.
 *
 * The seat cap is enforced here rather than in the stepper, because the
 * stepper is client-side and the endpoint is public. For the same reason the
 * open path is bounded: it is the only branch that *creates* a row, so it is
 * the only branch an attacker can use to grow the collection, and the ceiling
 * below is what stops that regardless of how many IPs they spread across.
 */
export async function submitRsvp(
  eventId: string,
  input: RsvpInput,
): Promise<RsvpResult> {
  await connectToDatabase();

  const event = await Event.findById(eventId)
    .select(
      "rsvpEnabled rsvpDeadline allowOpenRsvp maxPartySize openRsvpLimit isPublished",
    )
    .lean();

  if (!event || !event.isPublished || event.rsvpEnabled === false) {
    return { ok: false, reason: "closed" };
  }

  if (event.rsvpDeadline && new Date() > new Date(event.rsvpDeadline)) {
    return { ok: false, reason: "closed" };
  }

  const maxPartySize = event.maxPartySize ?? 4;
  const partySize = input.status === "attending" ? input.partySize : 0;

  if (input.token) {
    const guest = await Guest.findOne({ eventId, token: input.token });
    if (!guest) return { ok: false, reason: "not-found" };

    // A named guest is capped by the seats the couple set aside for them. An
    // open responder was never granted any, so they are capped by the event's
    // ceiling — *not* by whatever they happened to claim on their first answer,
    // which would let someone drop to one seat and then be unable to go back up.
    const isOpen = guest.source === "open";
    const cap = isOpen ? maxPartySize : (guest.seats ?? 1);

    if (partySize > cap) {
      return { ok: false, reason: "over-capacity" };
    }

    guest.set({
      status: input.status,
      partySize,
      note: input.note ?? null,
      respondedAt: new Date(),
      // An open responder's seat allowance is just whatever they last claimed;
      // keep it in step so the couple's "seats allocated" total stays honest.
      ...(isOpen ? { seats: Math.max(partySize, 1) } : {}),
    });
    await guest.save();

    return { ok: true, guest: toRecord(guest.toObject()) };
  }

  if (event.allowOpenRsvp === false) {
    return { ok: false, reason: "closed" };
  }

  if (partySize > maxPartySize) {
    return { ok: false, reason: "over-capacity" };
  }

  if (!input.name) {
    return { ok: false, reason: "not-found" };
  }

  // Counted rather than kept as a running total on the event: the couple can
  // delete a spam row, and a counter that only ever goes up would keep the
  // event closed after they had cleaned it out.
  const openCount = await Guest.countDocuments({ eventId, source: "open" });
  if (openCount >= (event.openRsvpLimit ?? DEFAULT_OPEN_RSVP_LIMIT)) {
    return { ok: false, reason: "open-limit" };
  }

  const doc = await Guest.create({
    eventId,
    name: input.name,
    phone: input.phone ?? null,
    seats: Math.max(partySize, 1),
    // Open responders get a token as well. It is what lets them come back and
    // change their answer: without one, every revision would fall through to
    // this branch again and append a *second* row, quietly inflating the
    // confirmed headcount. It also keeps a literal null out of the unique index
    // on `token`, which is what made the second open RSVP 500 — see models/Guest.
    token: generateToken(),
    status: input.status,
    partySize,
    note: input.note ?? null,
    respondedAt: new Date(),
    openedAt: new Date(),
    source: "open",
  });

  return { ok: true, guest: toRecord(doc.toObject()) };
}
