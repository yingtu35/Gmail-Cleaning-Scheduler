import NextAuth from "next-auth";
import { autoConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth(autoConfig);