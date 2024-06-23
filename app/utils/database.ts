import { UserInDB } from "@/app/lib/definitions";

export function isValidUser(user: UserInDB | null): user is UserInDB{
  return user !== null && user.id !== undefined;
}
