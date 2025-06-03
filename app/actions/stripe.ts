'use server'

import { headers } from 'next/headers'

import { stripe } from '@/libs/stripe/client'
import log from '@/utils/log'

export async function fetchClientSecret(): Promise<string> {
  const origin = (await headers()).get('origin')

  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded',
    line_items: [
      {
        price: 'price_1RVq8HP7Yi2pE4hDkctogshj',
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