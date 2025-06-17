import { eq } from "drizzle-orm";
import { db } from "@/models/db";
import { SubscriptionsTable } from "@/models/schema";
import { Subscription, NewSubscription, UpdatedSubscription } from "@/types/subscription";

export async function findSubscriptionById(subscriptionId: string): Promise<Subscription | null> {
    const subscription = await db.query.SubscriptionsTable.findFirst({
      where: eq(SubscriptionsTable.subscriptionId, subscriptionId),
    });
    return subscription ?? null;
}

export async function findSubscriptionByUserId(userId: string): Promise<Subscription | null> {
    const subscription = await db.query.SubscriptionsTable.findFirst({
      where: eq(SubscriptionsTable.userId, userId),
    });
    return subscription ?? null;
}

export async function createSubscription(subscription: NewSubscription): Promise<Subscription | null> {
    const result = await db.insert(SubscriptionsTable).values(subscription).returning();
    if (!result || result.length === 0) {
      return null;
    }
    return result[0];
}

export async function updateSubscription(subscriptionId: string, subscription: UpdatedSubscription): Promise<Subscription | null> {
    const result = await db.update(SubscriptionsTable)
      .set(subscription)
      .where(eq(SubscriptionsTable.subscriptionId, subscriptionId))
      .returning();
    if (!result || result.length === 0) {
      return null;
    }
    return result[0];
}
  
export async function deleteSubscription(subscriptionId: string): Promise<Subscription | null > {
    const result = await db.delete(SubscriptionsTable)
      .where(eq(SubscriptionsTable.subscriptionId, subscriptionId))
      .returning();
    return result[0] ?? null;
}