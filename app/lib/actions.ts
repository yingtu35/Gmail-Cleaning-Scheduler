'use server'

// specify all server actions here
import { signIn, signOut } from "@/auth";

export async function authenticate() {
  await signIn('google');
}

export async function logOut() {
  await signOut();
}