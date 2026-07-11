import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { uploadEventImage } from "@/lib/storage";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "لم يتم إرفاق أي ملف" }, { status: 400 });
  }

  try {
    const url = await uploadEventImage(file, session.user.id);
    return NextResponse.json({ url }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "تعذّر رفع الصورة";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
