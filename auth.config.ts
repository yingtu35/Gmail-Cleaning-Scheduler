import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import github from "next-auth/providers/github";

export const autoConfig = {
  providers: [
    // Set scope to repo to access user's private repositories
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  // pages: {
  //   signIn: "/", // ? Redirect to home page
  // },
  callbacks: {
    // async signIn({ user, account, profile }) {
    //   // console.log('signIn', user, account, profile);
    //   return true;
    // },
    // async jwt({ token, account }) {
    //   console.log('jwt', token, account);
    //   if (account) {
    //     token = Object.assign({}, token, { access_token: account.access_token });
    //   }
    //   return token;
    // },
    async session({ session, token }) {
      console.log('session', session, token)
      if (session) {
        session = Object.assign({}, session, { access_token: token.access_token })
      }
      return session;
    },
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
    //     return Response.redirect(new URL('/', nextUrl));
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