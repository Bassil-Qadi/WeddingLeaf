import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe half of the Auth.js config: no database, no bcrypt, no mongoose.
 *
 * `proxy.ts` gets bundled for a V8 isolate by some hosts (Netlify compiles it
 * into an Edge Function), so anything it imports must avoid Node built-ins.
 * Verifying a JWT needs only the secret and these callbacks, so proxy builds
 * its own NextAuth instance from this object and never pulls in `lib/auth.ts`.
 */
export const authConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/sign-in",
  },
  // Real providers are attached in `lib/auth.ts`. Session verification does
  // not consult the provider list, so an empty array is correct here.
  providers: [],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

export default authConfig;
