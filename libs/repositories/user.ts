import { eq } from "drizzle-orm";
import { db } from "@/models/db";
import { UserTable } from "@/models/schema";
import { NewUser, User, UserInfo, UserInfoFromGoogle } from "@/types/user";

export async function getUserById(userId: string): Promise<User | null> {
  const user = await db.query.UserTable.findFirst({
    where: eq(UserTable.id, userId),
  });
  return (user as User) ?? null;
}

export async function getUserByEmail(email: string): Promise<UserInfo | null> {
    const user = await db.query.UserTable.findFirst({
      where: eq(UserTable.email, email),
      columns: { 
        id: true,
        name: true,
        email: true,
        image: true
      }
    });
    return (user as UserInfo) ?? null;
}

export async function createUser(user: NewUser) {
    await db.insert(UserTable).values(user)
    .onConflictDoUpdate({
      target: UserTable.email,
      set: {
        name: user.name,
        image: user.image,
        accessToken: user.accessToken,
        accessTokenUpdatedAt: user.accessTokenUpdatedAt,
        refreshToken: user.refreshToken,
      }
    });
}

export async function updateUserOnSignIn(user: UserInfoFromGoogle) {
    await db.update(UserTable).set({
      name: user.name,
      image: user.image,
    })
    .where(eq(UserTable.email, user.email));
}

export async function updateUserToken(userId: string, accessToken: string, accessTokenUpdatedAt: Date) {
    await db.update(UserTable).set({
      accessToken,
      accessTokenUpdatedAt,
    }).where(eq(UserTable.id, userId));
} 