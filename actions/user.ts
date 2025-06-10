'use server'

import { auth } from "@/auth";
import * as userRepository from '@/libs/repositories/user';

import { User, NewUser, UserInfo, SessionUser, UserInfoFromGoogle } from "@/types/user";
import log from "@/utils/log";

export const getAuthenticatedUser = async () => {
    const session = await auth();
    if (!session) {
      return { isAuthenticated: false, user: null };
    }
    const user = session.user
    return { isAuthenticated: true, user };
}
  
export async function getSessionUser(): Promise<SessionUser | null> {
    const session = await auth();
  
    if (!session?.user?.id) { // Check for id as the primary indicator of a valid session user
      log.warn("getSessionUser: Session, session.user, or session.user.id is missing.");
      return null;
    }
  
    const sessionUser: SessionUser = {
      id: session.user.id,
      name: session.user.name ?? null,
      email: session.user.email ?? null,
      image: session.user.image ?? null,
      accessToken: session.access_token ?? null,
      expiresAt: session.expiresAt ?? null,
    };
  
    return sessionUser;
}
  
export async function getDatabaseUser(): Promise<User | null> {
    const session = await auth();
    if (!session?.user?.id) { // Check for id as the primary indicator of a valid session user
      log.warn("getDatabaseUser: Session, session.user, or session.user.id is missing.");
      return null;
    }
    const user = await userRepository.getUserById(session.user.id);
    if (!user) {
      return null;
    }
    return user;
}
  
export async function getUserInfoByEmail(email: string): Promise<UserInfo | null> {
    return await userRepository.getUserByEmail(email);
}
  
// get user by id from the database
export async function getDatabaseUserById(id: string) {
    return await userRepository.getUserById(id);
}
  
export async function updateUserOnSignIn(user: UserInfoFromGoogle) {
    await userRepository.updateUserOnSignIn(user)
    return;
}
  
// create a new user in the database
export async function createUserOnSignIn(user: NewUser) {
    await userRepository.createUser(user);
    return;
} 