import { pgTable, uuid, integer, varchar, text, timestamp, boolean, interval, uniqueIndex } from 'drizzle-orm/pg-core';
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
  title: text('title').notNull(),
  description: text('description'),
  tasks: varchar('tasks').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  isRepeatable: boolean('is_repeatable').default(false),
  repeatInterval: interval('repeat_interval'),
  repeatCount: integer('repeat_count').default(0),
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
