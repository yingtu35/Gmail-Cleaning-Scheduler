import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import { NewUser } from "@/types/user";
import { epochToDate } from "@/utils/date";
import { createUserOnSignIn, getUserIdByEmail, updateUserOnSignIn, subscribeEmailNotification } from "@/libs/actions";
import log from "@/utils/log";

export const autoConfig = {
  providers: [
    // Set scope to repo to access user's private repositories
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      authorization: {
        params: { 
          access_type: "offline", 
          // prompt: "consent", 
          scope: "openid email profile https://mail.google.com/"
      }
    }}),
  ],
  // pages: {
  //   signIn: "/", // ? Redirect to home page
  // },
  callbacks: {
    /* Use the signIn() callback to control if a user is allowed to sign in. */
    async signIn({ user, account, profile }) {
      log.debug("signIn: ", user, account, profile);
      // reject sign in if email is not verified
      if (account?.email_verified === false) {
        return false;
      }
      if (!user.email || !user.name) {
        return false;
      }
      const newUser: NewUser = {
        name: user.name,
        email: user.email,
        image: user.image as string,
        accessToken: account?.access_token as string,
        expiresAt: epochToDate(account?.expires_at),
        refreshToken: account?.refresh_token,
      };
      const existingUserId = await getUserIdByEmail(user.email);
      if (existingUserId) {
        await updateUserOnSignIn(newUser);
      } else {
        await createUserOnSignIn(newUser);
        await subscribeEmailNotification(user.email);
      }
      return true;
    },

    authorized({ request, auth }) {
      const { pathname } = request.nextUrl
      if (pathname === "/middleware-example") return !!auth
      return true
    },
  },
} satisfies NextAuthConfig;