import { SubscriptionsTable } from '@/models/schema';
import { TierDetails } from './membershipTier';

export type Subscription = typeof SubscriptionsTable.$inferSelect;

export type NewSubscription = typeof SubscriptionsTable.$inferInsert;

export type UpdatedSubscription = Partial<Subscription>
export enum SubscriptionStatus {
  ACTIVE = 'active',
  PAST_DUE = 'past_due',
  UNPAID = 'unpaid',
  CANCELED = 'canceled',
}

export type SubscriptionDetails = Pick<Subscription, 
  'status'   |
  'cancelAt' |
  'canceledAt'
> & {
  tierDetails: TierDetails;
}