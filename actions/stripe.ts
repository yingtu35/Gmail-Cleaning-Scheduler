import Stripe from "stripe";

import { stripe } from "@/libs/stripe/client";
import log from "@/utils/log";
import { 
  NewSubscription, 
  UpdatedSubscription, 
  SubscriptionStatus 
} from "@/types/subscription";
import { 
  createSubscription, 
  deleteSubscription, 
  getMembershipTierByPriceId, 
  getSubscriptionById, 
  getUserInfoByEmail,
  updateSubscription
} from "@/libs/actions";

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

    if (!line_items || !line_items.data || line_items.data.length === 0) {
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

async function fulfillUpdatedSubscription(
  session: Stripe.Subscription, 
  status: SubscriptionStatus.ACTIVE,
  eventCreatedAt: number
): Promise<boolean> {
  const { 
    id: subscriptionId,
    cancel_at: cancelAtInSeconds, // timestamp when the subscription will be canceled
    canceled_at: canceledAtInSeconds, // timestamp when user cancels the subscription
    items
  } = session

  if (!items || !items.data || items.data.length === 0) {
    log.error('No items found in subscription', session)
    return false
  }

  const item = items.data[0]
  const { price } = item
  const { id: priceId } = price

  const subscription = await getSubscriptionById(subscriptionId)
  if (!subscription) {
    log.error('No subscription found in database', subscriptionId)
    return false
  }
  const membershipTier = await getMembershipTierByPriceId(priceId)
  if (!membershipTier) {
    log.error('No membership tier found in database', priceId)
    return false
  }

  const updatedSubscription: UpdatedSubscription = {
    status: status,
    membershipTierId: membershipTier.id,
    cancelAt: cancelAtInSeconds ? new Date(cancelAtInSeconds * 1000) : null,
    canceledAt: canceledAtInSeconds ? new Date(canceledAtInSeconds * 1000) : null,
    updatedAt: new Date(eventCreatedAt * 1000)
  }

  const isUpdated = await updateSubscription(subscriptionId,updatedSubscription)
  if (!isUpdated) {
    log.error('Failed to update subscription', updatedSubscription)
    return false
  }

  return true  
}

async function fulfillCanceledSubscription(
  session: Stripe.Subscription, 
): Promise<boolean> {
  const { id: subscriptionId } = session
  const subscription = await getSubscriptionById(subscriptionId)
  if (!subscription) {
    log.error('No subscription found in database', subscriptionId)
    return false
  }

  const isDeleted = await deleteSubscription(subscriptionId)
  if (!isDeleted) {
    log.error('Failed to delete subscription', subscriptionId)
    return false
  }

  return true
}

async function fulfillPastDueSubscription(
  session: Stripe.Subscription, 
  status: SubscriptionStatus.PAST_DUE,
  eventCreatedAt: number
): Promise<boolean> {
  const { 
    id: subscriptionId,
  } = session

  const subscription = await getSubscriptionById(subscriptionId)
  if (!subscription) {
    log.error('No subscription found in database', subscriptionId)
    return false
  }

  const pastDueSubscription: UpdatedSubscription = {
    status: status,
    updatedAt: new Date(eventCreatedAt * 1000)
  }

  const isUpdated = await updateSubscription(subscriptionId, pastDueSubscription)
  if (!isUpdated) {
    log.error('Failed to update subscription', pastDueSubscription)
    return false
  }

  return true
}

export async function handleUpdatedSubscription(event: Stripe.CustomerSubscriptionUpdatedEvent) {
  const { created: eventCreatedAt } = event
  const session: Stripe.Subscription = event.data.object
  log.debug('Updated subscription', session)

  const { status } = session

  let isFulfilled = false
  switch (status) {
    case SubscriptionStatus.ACTIVE:
      isFulfilled = await fulfillUpdatedSubscription(session, SubscriptionStatus.ACTIVE, eventCreatedAt)
      break
    case SubscriptionStatus.PAST_DUE:
      isFulfilled = await fulfillPastDueSubscription(session, SubscriptionStatus.PAST_DUE, eventCreatedAt)
      break
    // TODO: Handle other statuses, like incomplete, incomplete_expired, paused, unpaid, etc.
    default:
      log.error('Unknown subscription status', status)
      return false
  }
  if (!isFulfilled) {
    log.error('Failed to fulfill updated subscription', { session })
    return false
  }

  return true
}

export async function handleDeletedSubscription(event: Stripe.CustomerSubscriptionDeletedEvent) {
  const session: Stripe.Subscription = event.data.object
  log.debug('Deleted subscription', session)

  const { status } = session
  if (status !== SubscriptionStatus.CANCELED) {
    log.error('Subscription is not canceled', session)
    return false
  }

  const isFulfilled = await fulfillCanceledSubscription(session)
  if (!isFulfilled) {
    log.error('Failed to fulfill canceled subscription', session)
    return false
  }

  return true
}
