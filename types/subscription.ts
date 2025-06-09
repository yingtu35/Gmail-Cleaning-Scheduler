import { SubscriptionsTable } from '@/models/schema';

export type Subscription = typeof SubscriptionsTable.$inferSelect;

export type NewSubscription = typeof SubscriptionsTable.$inferInsert;

export type UpdatedSubscription = Partial<Subscription>
export enum SubscriptionStatus {
  ACTIVE = 'active',
  PAST_DUE = 'past_due',
  UNPAID = 'unpaid',
  CANCELED = 'canceled',
}