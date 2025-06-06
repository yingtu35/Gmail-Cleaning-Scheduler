import Stripe from 'stripe';
import "dotenv-flow/config";

import { NewMembershipTier, MembershipTierName, BillingInterval } from '@/types/membershipTier';

import { db } from '../db'
import { MembershipTiersTable } from '../schema';

// 1. Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

// 2. Fetch all active Prices in Stripe (you can filter by product or metadata if needed)
async function fetchActivePrices() {
  const prices: Stripe.Price[] = [];
  let hasMore = true;
  let startingAfter: string | undefined = undefined;

  while (hasMore) {
    const response: any = await stripe.prices.list({
      limit: 100,
      active: true,
      expand: ['data.product'], // expand product to get its name
      starting_after: startingAfter,
    });
    prices.push(...response.data);
    hasMore = response.has_more;
    if (hasMore) {
      startingAfter = response.data[response.data.length - 1].id;
    }
  }
  return prices;
}

// 3. Transform and upsert into MembershipTiers
async function syncMembershipTiers() {
  const prices = await fetchActivePrices();
  const membershipTiersNames = Object.values(MembershipTierName);
  const billingIntervals = Object.values(BillingInterval);

  for (const price of prices) {
    if (!price.active || !price.product || price.unit_amount == null) {
      continue;
    }

    const tierName = (price.product as Stripe.Product).name.toLowerCase();
    if (!membershipTiersNames.includes(tierName as MembershipTierName)) {
      console.error(`Tier name ${tierName} is not a valid membership tier name`);
      continue;
    }

    const billingInterval = price.recurring?.interval;
    if (!billingInterval || !billingIntervals.includes(billingInterval as BillingInterval)) {
      console.error(`Billing interval ${billingInterval} is not a valid billing interval`);
      continue;
    }

    const metadata = price.metadata;
    const maxActiveJobs = metadata["max_active_jobs"];
    const maxTotalJobs = metadata["max_total_jobs"];
    const maxEmailsPerExec = metadata["max_emails_per_exec"];
    const maxWindowInMinutes = metadata["max_window_in_minutes"];

    if (!maxActiveJobs || !maxTotalJobs || !maxEmailsPerExec || !maxWindowInMinutes) {
      console.error(`Price ${price.id} has missing metadata`);
      continue;
    }

    const maxActiveJobsInt = parseInt(maxActiveJobs)
    const maxTotalJobsInt = parseInt(maxTotalJobs);
    const maxEmailsPerExecInt = parseInt(maxEmailsPerExec);
    const maxWindowInMinutesInt = parseInt(maxWindowInMinutes);

    const newTier: NewMembershipTier = {
      name: tierName as MembershipTierName,
      priceId: price.id,
      priceCents: price.unit_amount,
      billingInterval: billingInterval as BillingInterval,
      maxActiveJobs: maxActiveJobsInt,
      maxTotalJobs: maxTotalJobsInt,
      maxEmailsPerExec: maxEmailsPerExecInt,
      maxWindowInMinutes: maxWindowInMinutesInt,
    }

    await db
      .insert(MembershipTiersTable)
      .values(newTier)
      .onConflictDoUpdate({
        target: MembershipTiersTable.priceId,
        set: {
          name: newTier.name,
          priceCents: newTier.priceCents,
          billingInterval: newTier.billingInterval,
          maxActiveJobs: newTier.maxActiveJobs,
          maxTotalJobs: newTier.maxTotalJobs,
          maxEmailsPerExec: newTier.maxEmailsPerExec,
          maxWindowInMinutes: newTier.maxWindowInMinutes,
          updatedAt: new Date(),
        },
      });
  }

  console.log(`✅ Synced ${prices.length} Stripe prices into MembershipTiers.`);
}

// Run it
syncMembershipTiers()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Error syncing membership tiers:', err);
    process.exit(1);
  });
