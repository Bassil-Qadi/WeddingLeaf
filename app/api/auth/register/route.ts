import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { signUpSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  const body = await request.json();
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