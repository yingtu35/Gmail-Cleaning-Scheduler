import Stripe from 'stripe';
import "dotenv-flow/config";

import { NewMembershipTier, MembershipTierName, BillingInterval } from '@/types/membershipTier';

import { db } from '../db'
import { MembershipTiersTable } from '../schema';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;  
if (!stripeSecretKey) {  
  console.error("FATAL: STRIPE_SECRET_KEY environment variable is not set. Please ensure it is defined in your .env file or environment.");  
  process.exit(1);  
} 

// 1. Initialize Stripe
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-05-28.basil',
});

// 2. Fetch all active Prices in Stripe (you can filter by product or metadata if needed)
async function fetchActivePrices() {
  const prices: Stripe.Price[] = [];
  let hasMore = true;
  let startingAfter: string | undefined = undefined;

  try {
    while (hasMore) {
      const response: Stripe.ApiList<Stripe.Price> = await stripe.prices.list({
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
  } catch (error) {
    console.error('Error fetching active prices:', error);
    // throw error to be caught by the caller
    throw error;
  }
}

// 3. Transform and upsert into MembershipTiers
async function syncMembershipTiers() {
  const prices = await fetchActivePrices();
  const membershipTiersNames = Object.values(MembershipTierName);
  const billingIntervals = Object.values(BillingInterval);

  // TODO: Use a transaction to ensure atomicity
  for (const price of prices) {
    if (!price.active || !price.product || price.unit_amount == null) {
      continue;
    }

    const product = price.product as Stripe.Product;
    if (typeof product !== 'object' || product === null || typeof product.name !== 'string') {
      console.warn(`Price ${price.id} has invalid or missing product name. Product data: ${JSON.stringify(price.product)}. Skipping.`);
      continue;
    }

    const tierName = product.name.toLowerCase();
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

    if (isNaN(maxActiveJobsInt) || isNaN(maxTotalJobsInt) || isNaN(maxEmailsPerExecInt) || isNaN(maxWindowInMinutesInt)) {  
      console.error(`Price ${price.id} has invalid non-numeric metadata. Values: maxActiveJobs=${maxActiveJobs}, maxTotalJobs=${maxTotalJobs}, maxEmailsPerExec=${maxEmailsPerExec}, maxWindowInMinutes=${maxWindowInMinutes}`);  
      continue;  
    }

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
