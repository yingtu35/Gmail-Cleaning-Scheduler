import { pgEnum, pgTable, uuid, integer, varchar, timestamp, index, uniqueIndex, json, serial, text } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

import { type FormValues, TaskStatus } from '@/types/task';
import { SubscriptionStatus } from '@/types/subscription';
import { BillingInterval, MembershipTierName } from '@/types/membershipTier';

const timestamps = {
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow(),
}

export function enumToPgEnum<T extends Record<string, any>>(
  myEnum: T,
): [T[keyof T], ...T[keyof T][]] {
  return Object.values(myEnum).map((value: any) => `${value}`) as any
}

export const UserTable = pgTable('user', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email').notNull().unique(),
  image: varchar('image'),
  accessToken: varchar('access_token').notNull(),
  accessTokenUpdatedAt: timestamp('access_token_updated_at', { withTimezone: true, mode: 'date' }).notNull(),
  refreshToken: varchar('refresh_token').notNull(),
  ...timestamps,
}, table => { 
  return {
    emailIndex: uniqueIndex('email_index').on(table.email),
    indexAccessTokenUpdatedAt: index('index_access_token_updated_at').on(table.accessTokenUpdatedAt)
  }
});

export const taskStatusEnum = pgEnum('status', enumToPgEnum(TaskStatus));

export const UserTasksTable = pgTable('task', {
  id: uuid('id').primaryKey().defaultRandom(),
  scheduleName: varchar('schedule_name', { length: 61 }).notNull().unique(),
  status: taskStatusEnum('status').notNull().default(TaskStatus.ACTIVE),
  emailsDeleted: integer('emails_deleted').notNull().default(0),
  successCounts: integer('success_counts').notNull().default(0),
  errorCounts: integer('error_counts').notNull().default(0),
  formValues: json('form_values').$type<FormValues>().notNull(),
  lastExecutedAt: timestamp('last_executed_at', { withTimezone: true, mode: 'date' }),
  nextExecutedAt: timestamp('next_executed_at', { withTimezone: true, mode: 'date' }),
  userId: uuid('user_id')
    .references(() => UserTable.id)
    .notNull(),
  ...timestamps,
}, (table) => {
  return {
    userStatusNextExecutedAtIndex: index('user_status_next_executed_at_index')
      .on(table.userId, table.status, table.nextExecutedAt),
  };
});

export const membershipTierNameEnum = pgEnum("membership_tier_name", enumToPgEnum(MembershipTierName));
export const billingIntervalEnum = pgEnum("billing_interval", enumToPgEnum(BillingInterval));

export const MembershipTiersTable = pgTable("membership_tier", {
  id: serial("id").primaryKey(),
  priceId: varchar("price_id", { length: 64 }).notNull().unique(), // PostgreSQL automatically create a unique B-tree index on the column
  name: membershipTierNameEnum("name").notNull(),
  priceCents: integer("price_cents").notNull(),
  billingInterval: billingIntervalEnum("billing_interval").notNull(),
  maxActiveJobs: integer("max_active_jobs").notNull(),
  maxTotalJobs: integer("max_total_jobs").notNull(),
  maxEmailsPerExec: integer("max_emails_per_exec").notNull(),
  maxWindowInMinutes: integer("max_window_in_minutes").notNull(),
  allowedScheduleFrequencies: text("allowed_schedule_frequencies")
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  ...timestamps,
});

export const subscriptionStatusEnum = pgEnum("subscription_status", enumToPgEnum(SubscriptionStatus));

export const SubscriptionsTable = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  subscriptionId: varchar("subscription_id", { length: 64 }).notNull().unique(),
  userId: uuid("user_id")
    .notNull()
    .references(() => UserTable.id)
    .unique(),
  membershipTierId: integer("membership_tier_id")
    .notNull()
    .references(() => MembershipTiersTable.id),
  status: subscriptionStatusEnum("status").notNull(),
  cancelAt: timestamp("cancel_at", { withTimezone: true, mode: 'date' }),
  canceledAt: timestamp("canceled_at", { withTimezone: true, mode: 'date' }),
  ...timestamps,
});

/* Define relations between user table and other tables */
export const UserTableRelations = relations(UserTable, ( { one, many }) => ({
  tasks: many(UserTasksTable),
  subscription: one(SubscriptionsTable)
}));

export const UserTasksTableRelations = relations(UserTasksTable, ( { one }) => ({
  user: one(UserTable, {
    fields: [UserTasksTable.userId],
    references: [UserTable.id]
  })
}));

export const MembershipTiersTableRelations = relations(MembershipTiersTable, ( { many }) => ({
  subscriptions: many(SubscriptionsTable)
}));

export const SubscriptionsTableRelations = relations(SubscriptionsTable, ( { one }) => ({
  user: one(UserTable, {
    fields: [SubscriptionsTable.userId],
    references: [UserTable.id]
  }),
  membershipTier: one(MembershipTiersTable, {
    fields: [SubscriptionsTable.membershipTierId],
    references: [MembershipTiersTable.id]
  })
}));