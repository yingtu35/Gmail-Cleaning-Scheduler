'use server'

import Stripe from 'stripe'
import { headers } from 'next/headers'

import { stripe } from '@/libs/stripe/client'
import { getSessionUser } from '@/libs/actions'

export async function fetchClientSecret(): Promise<string> {
  const origin = (await headers()).get('origin')

  if (!origin) {
    throw new Error('No origin')
  }

  const sessionUser = await getSessionUser()

  if (!sessionUser) {
    throw new Error('No session user found. Expected a valid user object.')
  }

  const { email: customerEmail } = sessionUser

  if (!customerEmail) {
    throw new Error('No customer email found. Expected a valid email address.')
  }

  const params: Stripe.Checkout.SessionCreateParams = {
    ui_mode: 'embedded',
    payment_method_types: ['card'],
    customer_email: customerEmail,
    line_items: [
      {
        price: process.env.STRIPE_PRO_PRICE_ID,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    return_url: `${origin}/return?session_id={CHECKOUT_SESSION_ID}`
  }

  const session = await stripe.checkout.sessions.create(params)

  if (!session.client_secret) {
    throw new Error('No client secret found. Expected a valid client secret string.')
  }

  return session.client_secret
}