'use server'

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
    throw new Error('No session user')
  }

  const { email: customerEmail } = sessionUser

  if (!customerEmail) {
    throw new Error('No customer email')
  }

  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded',
    customer_email: customerEmail,
    line_items: [
      {
        price: process.env.STRIPE_PRO_PRICE_ID,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    return_url: `${origin}/return?session_id={CHECKOUT_SESSION_ID}`
  })

  if (!session.client_secret) {
    throw new Error('No client secret')
  }

  return session.client_secret
}