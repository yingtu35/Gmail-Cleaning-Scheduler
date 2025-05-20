import { UserTable } from '@/models/schema';

export type NewUser = typeof UserTable.$inferInsert;

export type User = typeof UserTable.$inferSelect;

export type UserDateTimePromptType = {
  date: string;
  time: string;
  timezone: string;
}