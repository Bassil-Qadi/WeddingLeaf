import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { signInSchema } from "@/lib/validations/auth";

export const { handlers, auth, signIn, signOut } = NextAuth({
  // JWT sessions: no database adapter needed. We look users up ourselves
  // via Mongoose inside `authorize`, so there's no version conflict
  // between mongoose's bundled mongodb driver and @auth/mongodb-adapter's.
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/sign-in",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (rawCredentials) => {
        const parsed = signInSchema.safeParse(rawCredentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        await connectToDatabase();
        const user = await User.findOne({ email }).select("+passwordHash");
        if (!user) return null;

        const isValidPassword = await bcrypt.compare(
          password,
          user.passwordHash,
        );
        if (!isValidPassword) return null;

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image ?? undefined,
        };
      },
    }),
    // Add OAuth providers here later, e.g. Google:
    // Google({ clientId: process.env.AUTH_GOOGLE_ID, clientSecret: process.env.AUTH_GOOGLE_SECRET }),
  ],
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
});