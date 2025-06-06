import Stripe from "stripe";

import { stripe } from "@/libs/stripe/client";
import log from "@/utils/log";
import { NewSubscription, SubscriptionStatus } from "@/types/subscription";
import { createSubscription, getMembershipTierByPriceId, getUserInfoByEmail } from "@/libs/actions";

async function fullfillCheckoutOrder(lineItem: Stripe.LineItem, checkoutSession: Stripe.Checkout.Session) {
  const { price } = lineItem
  const { 
    customer_email, 
    subscription: subscriptionId,
    created: createdAtInSeconds,
  } = checkoutSession
  if (!customer_email) {
    log.error('No customer email found in checkout session', checkoutSession)
    return false
  }

  if (!subscriptionId) {
    log.error('No subscription found in checkout session', checkoutSession)
    return false
  }
  if (typeof subscriptionId !== 'string') {
    log.error('Subscription id is not a string', subscriptionId)
    return false
  }
  if (!price) {
    log.error('No price found in line item', lineItem)
    return false
  }

  const { id: priceId } = price

  // Get the user by email from the database
  const user = await getUserInfoByEmail(customer_email)
  if (!user) {
    log.error('No user found in database', customer_email)
    return false
  }
  // Get the membership tier by id from the database
  const membershipTier = await getMembershipTierByPriceId(priceId)
  if (!membershipTier) {
    log.error('No membership tier price id found in database', priceId)
    return false
  }

  const newSubscription: NewSubscription = {
    subscriptionId: subscriptionId,
    userId: user.id,
    membershipTierId: membershipTier.id,
    status: SubscriptionStatus.ACTIVE,
    cancelAt: null,
    canceledAt: null,
    createdAt: new Date(createdAtInSeconds * 1000),
    updatedAt: new Date(createdAtInSeconds * 1000),
  }
  
  const subscription = await createSubscription(newSubscription)
  if (!subscription) {
    log.error('Failed to create subscription', newSubscription)
    return false
  }
  
  return true
}

export async function handleCompletedCheckoutSession(event: Stripe.CheckoutSessionCompletedEvent) {
  const session: Stripe.Checkout.Session = event.data.object
  const sessionId = session.id

  try {
    // Retrieve the Checkout Session from the API with line_items expanded
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items'],
    });

    const { payment_status, line_items } = checkoutSession

    if (!line_items) {
      log.error('No line items found in checkout session', checkoutSession)
      return false
    }

    if (payment_status === 'unpaid') {
      log.error('Checkout session is unpaid', checkoutSession)
      return false
    }

    const lineItem = line_items.data[0]
    const isFulfilled = await fullfillCheckoutOrder(lineItem, checkoutSession)

    if (!isFulfilled) {
      log.error('Failed to fulfill order', { lineItem, checkoutSession })
      return false
    }

    return true
  } catch (err: any) {
    log.error('Failed to retrieve checkout session', err)
    return false
  }
}
