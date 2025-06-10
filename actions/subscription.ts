'use server'

import * as subscriptionRepository from '@/libs/repositories/subscription';
import * as membershipRepository from '@/libs/repositories/membership';

import { MembershipTier } from '@/types/membershipTier';
import { NewSubscription, Subscription, UpdatedSubscription } from '@/types/subscription';

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