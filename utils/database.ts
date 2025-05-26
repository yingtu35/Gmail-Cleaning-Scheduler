import { User, UserInfo, UserInfoFromGoogle } from "@/types/user";

export function isValidUser(user: User | null): user is User{
  return user !== null
}

export function isValidUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

export function hasChangedUserInfo(existingUser: UserInfo, newUser: UserInfoFromGoogle): boolean {
  return existingUser.name !== newUser.name || existingUser.image !== newUser.image;
}

enum MAX_TASKS_COUNT {
  FREE = 5,
  PRO = 20,
}

export function hasReachedTaskLimit(numOfTasks: number): boolean {
  return numOfTasks >= MAX_TASKS_COUNT.FREE;
}
