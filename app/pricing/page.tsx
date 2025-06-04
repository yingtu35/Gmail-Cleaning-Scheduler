import Pricing from '@/components/pricing';
import { getSessionUser } from '@/libs/actions';

export default async function Page() {
  const sessionUser = await getSessionUser()
  if (!sessionUser) {
    throw new Error('No session user found. Expected a valid user object.')
  }
  const { email: customerEmail } = sessionUser

  if (!customerEmail) {
    throw new Error('No customer email found. Expected a valid email address.')
  }

  return (
    <Pricing customerEmail={customerEmail} />
  )
}