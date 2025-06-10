import NextAuth, { DefaultSession } from "next-auth";
import { JWT as NextAuthJWT } from "next-auth/jwt";

import { type SubscriptionDetails } from "@/types/subscription";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    access_token?: string;
    expiresAt?: number;
    user: {
      /** Oauth access token */
      id?: string;
      subscriptionDetails?: SubscriptionDetails | null;
    } & DefaultSession["user"];
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
    accessToken?: string;
    expiresAt?: number;
    subscriptionDetails?: SubscriptionDetails | null;
    // We don't store refreshToken in JWT for security, but if you had other custom fields:
    // customField?: string;
  }
}