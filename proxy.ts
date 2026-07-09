import NextAuth from "next-auth";
import { NextResponse } from "next/server";

import { authConfig } from "./lib/auth.config";

// Deliberately not imported from `./lib/auth`: that module pulls in mongoose
// and bcrypt, which cannot be bundled for an edge runtime.
const { auth } = NextAuth(authConfig);

export default auth((request) => {
  if (request.auth) {
    return NextResponse.next();
  }

  const signInUrl = new URL("/auth/sign-in", request.nextUrl.origin);
  signInUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
  return NextResponse.redirect(signInUrl);
});

export const config = {
  matcher: ["/dashboard/:path*"],
};
