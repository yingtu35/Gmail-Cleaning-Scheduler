'use server'

import { signIn, signOut } from "@/auth";

export async function authenticate() {
  await signIn('google', { callbackUrl: '/' });
}

export async function logOut() {
  await signOut({ redirectTo: '/' });
} 