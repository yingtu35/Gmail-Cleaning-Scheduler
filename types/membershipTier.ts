import { MembershipTiersTable } from '@/models/schema';

export enum BillingInterval {
  MONTH = 'month',
  YEAR = 'year',
}

export enum MembershipTierName {
  BASIC = 'basic',
  PRO = 'pro',
  ENTERPRISE = 'enterprise',
}

export type MembershipTier = typeof MembershipTiersTable.$inferSelect;

export type NewMembershipTier = typeof MembershipTiersTable.$inferInsert;

export type TierDetails = 
  Pick<MembershipTier, 
    'name' | 
    'maxActiveJobs' | 
    'maxTotalJobs' | 
    'maxEmailsPerExec' | 
    'maxWindowInMinutes' | 
    'allowedScheduleFrequencies'
  >