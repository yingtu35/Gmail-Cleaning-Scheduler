import { pgTable, uuid, integer, varchar, timestamp, boolean, interval, uniqueIndex, json } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const UserTable = pgTable('user', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email').notNull().unique(),
  image: varchar('image'),
  accessToken: varchar('access_token').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  refreshToken: varchar('refresh_token'),
  createdAt: timestamp('created_at').defaultNow(),
}, table => {
  return {
    emailIndex: uniqueIndex('email_index').on(table.email)
  }
});

export const UserTasksTable = pgTable('task', {
  id: uuid('id').primaryKey().defaultRandom(),
  scheduleName: varchar('schedule_name', { length: 61 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  expiresAt: timestamp('expires_at'),
  repeatCount: integer('repeat_count').default(0),
  formValues: json('form_values').notNull(),
  userId: uuid('user_id')
    .references(() => UserTable.id)
    .notNull(),
});

/* Define relations between tables */
export const UserTableRelations = relations(UserTable, ( { many }) => ({
  tasks: many(UserTasksTable)
}));

export const UserTasksTableRelations = relations(UserTasksTable, ( { one }) => ({
  user: one(UserTable, {
    fields: [UserTasksTable.userId],
    references: [UserTable.id]
  })
}));
