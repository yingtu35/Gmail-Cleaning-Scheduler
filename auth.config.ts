import type { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";
import Google from "next-auth/providers/google";

import { NewUser, UserInfoFromGoogle } from "@/types/user";
import { createUserOnSignIn, getUserInfoByEmail, updateUserOnSignIn } from "@/actions/user";
import { subscribeEmailNotification } from "@/actions/notification";
import log from "@/utils/log";
import { hasChangedUserInfo } from "@/utils/database";
import { getSubscriptionDetails } from "./actions/subscription";

const SIGN_IN_PATH = "/";
const publicPaths = [SIGN_IN_PATH];

const REVALIDATE_INTERVAL = 5 * 60 * 1000; // 5 minutes in ms

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
      // Initial sign-in: Set user-specific token properties
      if (account && user && user.email) {
        token.accessToken = account.access_token;
        token.expiresAt = account.expires_at;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;

        try {
          const userInfo = await getUserInfoByEmail(user.email);
          if (userInfo?.id) {
            token.userId = userInfo.id;
          } else {
            log.error("JWT callback: Could not find user ID for email during initial sign-in", { email: user.email });
            return { ...token, error: "UserIDMissingError" }; 
          }
          // Fetch subscription details and set timestamp on initial sign-in
          token.subscriptionDetails = await getSubscriptionDetails(token.userId);
          token.subscriptionCheckedAt = Date.now();
        } catch (error) {
          log.error("JWT callback: Failed to fetch initial subscription details", { userId: token.userId, error });
          token.subscriptionDetails = null;
        }
      }

      // On every JWT evaluation, check if the subscription needs to be updated based on time interval.
      const now = Date.now();
      const shouldRefetch =
        !token.subscriptionDetails ||
        !token.subscriptionCheckedAt ||
        now - (token.subscriptionCheckedAt as number) > REVALIDATE_INTERVAL;

      if (shouldRefetch && token.userId) {
        try {
          token.subscriptionDetails = await getSubscriptionDetails(token.userId as string);
          token.subscriptionCheckedAt = now;
        } catch (error) {
          log.error("JWT callback: Failed to refresh subscription details", { userId: token.userId, error });
          token.subscriptionDetails = null;
        }
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
      if (token.subscriptionDetails) {
        session.user.subscriptionDetails = token.subscriptionDetails;
      } else {
        session.user.subscriptionDetails = null;
      }
      return session;
    },
    /* Use the signIn() callback to control if a user is allowed to sign in. */
    async signIn({ user, account, profile }) {
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
        return NextResponse.redirect(new URL(SIGN_IN_PATH, request.url));
      }
      return true;
    },
  },
} satisfies NextAuthConfig;