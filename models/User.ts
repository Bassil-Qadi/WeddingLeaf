import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    // Hashed with bcryptjs. Never store or return plaintext passwords.
    passwordHash: {
      type: String,
      required: true,
      select: false, // excluded from queries by default; opt in with .select("+passwordHash")
    },
    image: {
      type: String,
      default: null,
    },
    locale: {
      type: String,
      enum: ["ar", "en"],
      default: "ar",
    },
  },
  { timestamps: true },
);

export type UserDocument = InferSchemaType<typeof UserSchema>;

// Prevents Mongoose from redefining the model on every hot-reload in dev.
export const User: Model<UserDocument> =
  models.User || model<UserDocument>("User", UserSchema);

export default User;