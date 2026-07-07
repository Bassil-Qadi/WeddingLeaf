import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { auth } from "./lib/auth";

const PROTECTED_PREFIXES = ["/dashboard"];

export default async function proxy(request: NextRequest) {
  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    request.nextUrl.pathname.startsWith(prefix),
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  const session = await auth();

  if (!session) {
    const signInUrl = new URL("/auth/sign-in", request.url);
    signInUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};