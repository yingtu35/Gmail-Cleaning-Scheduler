'use server'

import * as subscriptionRepository from '@/libs/repositories/subscription';
import * as membershipRepository from '@/libs/repositories/membership';

import { MembershipTier, TierDetails } from '@/types/membershipTier';
import { NewSubscription, Subscription, UpdatedSubscription, SubscriptionDetails } from '@/types/subscription';

export async function getMembershipTierByPriceId(priceId: string): Promise<MembershipTier | null> {
    return await membershipRepository.findMembershipTierByPriceId(priceId);
}
  
export async function getSubscriptionById(subscriptionId: string): Promise<Subscription | null> {
    return await subscriptionRepository.findSubscriptionById(subscriptionId);
}
  
export async function createSubscription(subscription: NewSubscription): Promise<Subscription | null> {
    return await subscriptionRepository.createSubscription(subscription);
}
  
export async function updateSubscription(subscriptionId: string, subscription: UpdatedSubscription): Promise<Subscription | null> {
    return await subscriptionRepository.updateSubscription(subscriptionId, subscription);
}
  
export async function deleteSubscription(subscriptionId: string): Promise<boolean> {
    const deletedSubscription = await subscriptionRepository.deleteSubscription(subscriptionId)
    if (!deletedSubscription) {
      return false;
    }
    return true;
}

export async function getMembershipTierDetailsById(membershipTierId: number): Promise<TierDetails | null> {
    return await membershipRepository.findMembershipTierDetailsById(membershipTierId);
}

export async function getSubscriptionDetails(userId: string): Promise<SubscriptionDetails | null> {
  const subscription = await subscriptionRepository.findSubscriptionByUserId(userId);
  if (!subscription) {
    return null;
  }
  const tierDetails = await membershipRepository.findMembershipTierDetailsById(subscription.membershipTierId);
  if (!tierDetails) {
    return null;
  }
  
  const subscriptionDetails: SubscriptionDetails = {
    status: subscription.status,
    cancelAt: subscription.cancelAt,
    canceledAt: subscription.canceledAt,
    tierDetails: tierDetails,
  }
  return subscriptionDetails;
}