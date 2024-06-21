import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import { UserInDB } from "@/app/lib/definitions";
import { epochToDate } from "@/app/utils/date";
import { createUserOnSignIn, getUserIdByEmail, updateUserOnSignIn, subscribeEmailNotification } from "@/app/lib/actions";

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
      console.log('signIn', account);
      // reject sign in if email is not verified
      if (account?.email_verified === false) {
        return false;
      }
      if (!user.email || !user.name) {
        return false;
      }
      const newUser: UserInDB = {
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

    /* This callback is called whenever a JSON Web Token is created. returned value will be encrypted, and it is stored in a cookie called "authjs.session-token" */
    // async jwt({ token, account }) {
    //   console.log('jwt', account);
    //   if (account) {
    //     token = Object.assign({}, token, { access_token: account.access_token });
    //   }
    //   return token;
    // },

    // async session({ session }) {
    //   // if (token?.access_token) {
    //   // session = Object.assign({}, session, { access_token: token.access_token })
    //   //   // console.log('session after', session)
    //   // }
    //   await setUserId(session)
    //   return session;
    // },
    // * authorized is called when a user visits a page that requires authentication
    // authorized({ auth, request: { nextUrl } }) {
    //   console.log('authorized', auth, nextUrl);
    //   const isLoggedIn = !!auth?.user;
    //   const isOnDashboard = nextUrl.pathname.startsWith('/');
    //   if (isOnDashboard) {
    //     if (isLoggedIn) return true;
    //     return false; // Redirect unauthenticated users to login page
    //   } 
    //   else if (isLoggedIn) {
        // return Response.redirect(new URL('/', nextUrl));
    //   }
    //   return true;
    // },
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl
      if (pathname === "/middleware-example") return !!auth
      return true
    },
  },
} satisfies NextAuthConfig;