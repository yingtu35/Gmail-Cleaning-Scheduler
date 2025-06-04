import { type Stripe, loadStripe } from '@stripe/stripe-js'

/**
 * The Stripe instance
 */
let stripePromise: Promise<Stripe | null>

/**
 * Get the Stripe instance
 * Uses a singleton pattern to ensure that the Stripe instance is only loaded once
 * @returns {Promise<Stripe | null>}
 */
const getStripe =() => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
  }
  return stripePromise
}

export {
  getStripe
}