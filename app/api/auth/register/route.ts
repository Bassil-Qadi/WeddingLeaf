import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { connectToDatabase } from "@/lib/mongodb";
import { rateLimitByIp } from "@/lib/rate-limit";
import { User } from "@/models/User";
import { signUpSchema } from "@/lib/validations/auth";

/**
 * Signing up is a once-per-person act, so this can be tight. It bounds two
 * different costs: rows in the `users` collection, and CPU — a bcrypt hash at
 * cost 12 is deliberately expensive, which makes an unthrottled register
 * endpoint a cheap way for someone else to spend our compute.
 */
const REGISTER_LIMIT = 5;
const REGISTER_WINDOW_MS = 60 * 60 * 1000;

export async function POST(request: Request) {
  const limit = await rateLimitByIp(
    request,
    "register",
    REGISTER_LIMIT,
    REGISTER_WINDOW_MS,
  );

  if (!limit.ok) {
    return NextResponse.json(
      { error: { email: ["محاولات كثيرة. يُرجى المحاولة لاحقًا"] } },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = signUpSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { name, email, password } = parsed.data;

  await connectToDatabase();

  const existing = await User.findOne({ email });
  if (existing) {
    return NextResponse.json(
      { error: { email: ["البريد الإلكتروني مستخدم بالفعل"] } },
      { status: 409 },
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await User.create({ name, email, passwordHash });

  return NextResponse.json(
    { id: user._id.toString(), name: user.name, email: user.email },
    { status: 201 },
  );
}