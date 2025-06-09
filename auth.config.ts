import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import { NewUser, UserInfoFromGoogle } from "@/types/user";
import { createUserOnSignIn, getUserInfoByEmail, updateUserOnSignIn, subscribeEmailNotification } from "@/libs/actions";
import log from "@/utils/log";
import { hasChangedUserInfo } from "@/utils/database";
import { NextResponse } from "next/server";

const SIGN_IN_PATH = "/";
const publicPaths = [SIGN_IN_PATH];

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
      }
    }),
  ],
  pages: {
    signIn: SIGN_IN_PATH, // Specify the sign-in page when redirecting to it
  },
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
        return token;
      }
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
      if (!account || !profile) {
        log.error("signIn: No account or profile found");
        return false;
      }
      if (!profile.email_verified || !account.access_token) {
        log.error("signIn: Account is not verified or access token is missing");
        return false;
      }
      if (!user.email || !user.name) {
        log.error("signIn: User email or name is missing");
        return false;
      }

      const userInfo: UserInfoFromGoogle = {
        name: user.name,
        email: user.email,
        image: user.image as string,
      }
      const existingUser = await getUserInfoByEmail(user.email);
      if (!existingUser) {
        if (!account.refresh_token) {
          log.error("signIn: User does not exist, and no refresh token found");
          return false;
        }
        const newUser: NewUser = {
          ...userInfo,
          accessToken: account.access_token,
          accessTokenUpdatedAt: new Date(),
          refreshToken: account.refresh_token,
        }
        log.debug("signIn: User does not exist, creating user", { newUser });
        await createUserOnSignIn(newUser);
        await subscribeEmailNotification(user.email);
      } else if (hasChangedUserInfo(existingUser, userInfo)) {
        log.debug("signIn: User info has changed, updating user", { userInfo });
        await updateUserOnSignIn(userInfo);
      }
      return true;
    },

    authorized({ request, auth }) {
      const { pathname } = request.nextUrl
      const isPublicPath = publicPaths.includes(pathname);
      if (isPublicPath) {
        return true;
      }

      const isAuthenticated = !!auth;
      if (!isAuthenticated) {
        return NextResponse.redirect(new URL('/', request.url));
      }
      return true;
    },
  },
} satisfies NextAuthConfig;