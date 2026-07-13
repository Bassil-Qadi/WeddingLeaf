import {
  Schema,
  model,
  models,
  type InferSchemaType,
  type Model,
} from "mongoose";

/**
 * A fixed-window request counter, kept in Mongo rather than in process memory.
 *
 * An in-memory `Map` is the usual first instinct and it is the wrong one here:
 * the app runs as serverless functions, so every cold start hands the caller a
 * fresh empty map and therefore a fresh empty budget, and two warm instances
 * never see each other's counts. Mongo is already on the request path, one
 * upsert costs far less than the bcrypt hash or the RSVP write it guards, and
 * the count is shared across every instance.
 *
 * `key` carries the window it belongs to (see lib/rate-limit.ts), so each new
 * window is a new document rather than a read-modify-write of an old one, and
 * counting can be a single atomic `$inc`.
 */
const RateLimitSchema = new Schema({
  key: { type: String, required: true, unique: true },
  count: { type: Number, required: true, default: 0 },
  /** Mongo reaps these itself; nothing has to sweep the collection. */
  expiresAt: { type: Date, required: true },
});

RateLimitSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export type RateLimitDocument = InferSchemaType<typeof RateLimitSchema>;

export const RateLimit: Model<RateLimitDocument> =
  models.RateLimit || model<RateLimitDocument>("RateLimit", RateLimitSchema);

export default RateLimit;
