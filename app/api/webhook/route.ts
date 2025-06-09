import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

import { stripe } from "@/libs/stripe/client";
import log from "@/utils/log";
import { 
  handleCompletedCheckoutSession, 
  handleUpdatedSubscription,
  handleDeletedSubscription
} from "@/actions/stripe";

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!

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
      const isSessionHandled = await handleCompletedCheckoutSession(event)
      if (!isSessionHandled) {
        log.error('Failed to handle completed checkout session', event)
        return NextResponse.json({ error: 'Failed to handle completed checkout session' }, { status: 500 })
      }
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