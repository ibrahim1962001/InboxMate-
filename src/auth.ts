import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import type { UserRole } from "@prisma/client";

const GMAIL_SCOPES = [
  "openid",
  "email",
  "profile",
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.modify",
  "https://www.googleapis.com/auth/gmail.compose",
  "https://www.googleapis.com/auth/gmail.send",
].join(" ");

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: GMAIL_SCOPES,
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
  ],
  session: { strategy: "database" },
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
      if (adminEmail && user.email.toLowerCase() === adminEmail) {
        await prisma.user.update({
          where: { email: user.email },
          data: { role: "ADMIN" },
        });
      }

      const existing = await prisma.user.findUnique({
        where: { email: user.email },
        include: { subscription: true },
      });

      if (existing && !existing.subscription) {
        await prisma.userSubscription.create({
          data: { userId: existing.id, plan: "FREE", status: "ACTIVE" },
        });
      }

      return true;
    },
    async session({ session, user }) {
      if (session.user) {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { role: true, locale: true },
        });
        session.user.id = user.id;
        session.user.role = (dbUser?.role ?? "USER") as UserRole;
        session.user.locale = dbUser?.locale ?? "en";
      }
      return session;
    },
  },
  pages: {
    signIn: "/en/login",
  },
});
