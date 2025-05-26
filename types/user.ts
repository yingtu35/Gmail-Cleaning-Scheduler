import { UserTable } from '@/models/schema';

export type NewUser = typeof UserTable.$inferInsert;

export type User = typeof UserTable.$inferSelect;

export type UserInfo = Pick<User, 'id' | 'name' | 'email' | 'image'>;

export type UserDateTimePromptType = {
  date: string;
  time: string;
  timezone: string;
}

// Represents the user object as derived from the session
// Contains essential, authenticated user information readily available
export type SessionUser = {
  id: string; // Internal database user ID
  name?: string | null;
  email?: string | null;
  image?: string | null;
  accessToken?: string | null;
  expiresAt?: number | null;
  // Add other fields here if you consistently populate them in the session token
  // and want them available via the modified getUser()
};