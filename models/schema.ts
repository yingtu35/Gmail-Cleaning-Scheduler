import { pgEnum, pgTable, uuid, integer, varchar, timestamp, boolean, interval, uniqueIndex, json } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

import { type FormValues } from '@/types/task';

const timestamps = {
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}

export const UserTable = pgTable('user', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email').notNull().unique(),
  image: varchar('image'),
  accessToken: varchar('access_token').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  refreshToken: varchar('refresh_token'),
  ...timestamps,
}, table => {
  return {
    emailIndex: uniqueIndex('email_index').on(table.email)
  }
});

export const taskStatusEnum = pgEnum('status', ['active', 'paused', 'completed']);

export const UserTasksTable = pgTable('task', {
  id: uuid('id').primaryKey().defaultRandom(),
  scheduleName: varchar('schedule_name', { length: 61 }).notNull().unique(),
  status: taskStatusEnum('status').default('active'),
  emailsDeleted: integer('emails_deleted').default(0),
  successCounts: integer('success_counts').default(0),
  errorCounts: integer('error_counts').default(0),
  formValues: json('form_values').$type<FormValues>().notNull(),
  userId: uuid('user_id')
    .references(() => UserTable.id)
    .notNull(),
  ...timestamps,
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
