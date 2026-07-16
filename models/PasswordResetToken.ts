import {
  Schema,
  model,
  models,
  Types,
  type InferSchemaType,
  type Model,
} from "mongoose";

/**
 * A pending password reset. One row per outstanding request.
 *
 * The token is stored **hashed** (sha256), never in the clear: the raw value
 * goes out in the email and nowhere else, so a dump of this collection cannot
 * be replayed into an account takeover. Guest invitation tokens are stored raw
 * because the worst case there is a leaked guest list; here the worst case is
 * someone else's account, so it earns the extra step.
 *
 * `expiresAt` carries a TTL index — Mongo's reaper deletes the row within a
 * minute or so of expiry, so a stale link stops working on its own and the
 * collection never accumulates. A successful reset deletes the row immediately
 * (single-use); the TTL is only the backstop for links that are never clicked.
 */
const PasswordResetTokenSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    // sha256 of the raw token, hex-encoded. Unique so a lookup is a single
    // indexed hit and two requests can't collide on the same hash.
    tokenHash: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      // TTL: expire the document *at* expiresAt (expireAfterSeconds: 0 means
      // "when the indexed date is reached", not "keep for 0 seconds").
      index: { expires: 0 },
    },
  },
  { timestamps: true },
);

export type PasswordResetTokenDocument = InferSchemaType<
  typeof PasswordResetTokenSchema
> & { userId: Types.ObjectId };

export const PasswordResetToken: Model<PasswordResetTokenDocument> =
  models.PasswordResetToken ||
  model<PasswordResetTokenDocument>(
    "PasswordResetToken",
    PasswordResetTokenSchema,
  );

export default PasswordResetToken;
