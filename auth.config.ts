import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import { NewUser } from "@/types/user";
import { epochToDate } from "@/utils/date";
import { createUserOnSignIn, getUserInfoByEmail, updateUserOnSignIn, subscribeEmailNotification } from "@/libs/actions";
import log from "@/utils/log";
import { hasChangedUserInfo } from "@/utils/database";

export const autoConfig = {
  providers: [
    // Set scope to repo to access user's private repositories
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      authorization: {
        params: { 
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile https://mail.google.com/"
      }
    }}),
  ],
  // pages: {
  //   signIn: "/", // ? Redirect to home page
  // },
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign-in
      if (account && user) {
        // log.debug("JWT callback: Initial sign-in", { userEmail: user.email });
        token.accessToken = account.access_token;
        token.expiresAt = account.expires_at; // This is usually a timestamp in seconds
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;

        if (user.email) {
          const userIdRecord = await getUserInfoByEmail(user.email);
          if (userIdRecord && userIdRecord.id) {
            token.userId = userIdRecord.id;
            log.debug("JWT callback: userId added to token during initial sign-in", { userId: userIdRecord.id });
          } else {
            log.error("JWT callback: Could not find user ID for email during initial sign-in", { email: user.email });
            return { ...token, error: "UserIDMissingError" }; 
          }
        }
        // TODO: Implement token refresh logic here in the future.
        // This will involve checking if `token.accessToken` is expired using `token.expiresAt`,
        // and if so, using a refresh token (fetched from DB using `token.userId`) 
        // to get a new access token from Google.
        return token;
      }

      // For subsequent calls, return existing token (which might be expired if not refreshed)
      // Or if refresh logic was here, it would have already updated it.
      // log.debug("JWT callback: Subsequent call", { userId: token.userId, expiresAt: token.expiresAt });
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token and user ID from the token.
      if (token.accessToken) {
        session.access_token = token.accessToken as string;
      }
      if (token.userId) {
        // session.user.id is already part of the declared Session interface in types/next-auth-d.ts
        session.user.id = token.userId as string;
      }
      // If you added expiresAt to the token and want it in session:
      if (token.expiresAt) {
        session.expiresAt = token.expiresAt as number;
      }
      // log.debug("Session callback: updated session", { session });
      return session;
    },
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
      const existingUser = await getUserInfoByEmail(user.email);
      if (!existingUser) {
        log.debug("signIn: User does not exist, creating user", { newUser });
        await createUserOnSignIn(newUser);
        await subscribeEmailNotification(user.email);
      } else if (hasChangedUserInfo(existingUser, newUser)) {
        log.debug("signIn: User info has changed, updating user", { newUser });
        await updateUserOnSignIn(newUser);
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