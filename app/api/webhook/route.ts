import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

import { stripe } from "@/libs/stripe/client";
import log from "@/utils/log";

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!

async function fulfillOrder(lineItem: Stripe.LineItem, checkoutSession: Stripe.Checkout.Session) {
  // TODO: Implement the logic to fulfill the order
  await new Promise(resolve => setTimeout(resolve, 1000))
  log.info('Fulfilled order', { lineItem, checkoutSession })
  return true
}

async function handleCompletedCheckoutSession(event: Stripe.CheckoutSessionCompletedEvent) {
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

    if (payment_status == 'unpaid') {
      log.error('Checkout session is unpaid', checkoutSession)
      return false
    }

    const lineItem = line_items.data[0]
    const isFulfilled = await fulfillOrder(lineItem, checkoutSession)

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

async function handleUpdatedSubscription(event: Stripe.CustomerSubscriptionUpdatedEvent) {
  // TODO: Implement the logic to update the subscription
  const session: Stripe.Subscription = event.data.object
  log.debug('Updated subscription', session)

  return true
}

async function handleDeletedSubscription(event: Stripe.CustomerSubscriptionDeletedEvent) {
  // TODO: Implement the logic to delete the subscription
  const session: Stripe.Subscription = event.data.object
  log.debug('Deleted subscription', session)
  return true
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature!,
      STRIPE_WEBHOOK_SECRET
    )
  } catch (err: any) {
    log.error(err)
    return NextResponse.json({ error: err.message }, { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed':
      const savedSession = await handleCompletedCheckoutSession(event)
      if (!savedSession) {
        log.error('Failed to save completed checkout session', event)
        return NextResponse.json({ error: 'Failed to save completed checkout session' }, { status: 500 })
      }
      break
    case 'customer.subscription.created':
      // log.info('Customer subscription created ', event)
      break
    case 'customer.subscription.updated':
      const updatedSubscription = await handleUpdatedSubscription(event)
      if (!updatedSubscription) {
        log.error('Failed to update subscription', event)
        return NextResponse.json({ error: 'Failed to update subscription' }, { status: 500 })
      }
      break
    case 'customer.subscription.deleted':
      const deletedSubscription = await handleDeletedSubscription(event)
      if (!deletedSubscription) {
        log.error('Failed to delete subscription', event)
        return NextResponse.json({ error: 'Failed to delete subscription' }, { status: 500 })
      }
      break
    default:
      log.info('Unhandled event type ', event.type)
      break
  }

  return NextResponse.json({ received: true }, { status: 200 })
}