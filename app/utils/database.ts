import { UserInDB } from "@/app/lib/definitions";

export function isValidUser(user: UserInDB | null): user is UserInDB{
  return user !== null && user.id !== undefined;
}

export function isValidUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}
