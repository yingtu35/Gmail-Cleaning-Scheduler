import { redirect } from 'next/navigation'

import { stripe } from '@/libs/stripe/client'

export default async function Page({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const { session_id } = searchParams
  if (!session_id) {
    throw new Error('Missing session ids. Expected a valid session idstring.')
  }

  const sessionId = Array.isArray(session_id) ? session_id[0] : session_id

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['line_items', 'payment_intent']
  })

  const { status, customer_details } = session

  if (!status || !customer_details) {
    throw new Error('No status or customer_details')
  }

  const { email: customerEmail } = customer_details

  if (status === 'open') {
    return redirect('/')
  }

  if (status === 'complete') {
    return (
      <section id="success">
        <p>
          We appreciate your business! A confirmation email will be sent to{' '}
          {customerEmail}. If you have any questions, please email{' '}
        </p>
        <a href="mailto:orders@example.com">orders@example.com</a>.
      </section>
    )
  }

  return (
    <section id="error">
      <p>
        We were unable to process your payment. Please try again.
      </p>
    </section>
  )
  
}