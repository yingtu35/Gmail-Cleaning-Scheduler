import { subscribeEmailNotification } from "@/app/lib/actions";
import { cookies } from 'next/headers';
import { SubscriptionForm } from "@/app/components/confirm-sunscription/subscription-form";
export default async function Page({
  searchParams
} : {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const cookieStore = cookies();
  const email = searchParams?.email as string;
  if (!email) {
    return <div>Invalid email</div>
  }
  await subscribeEmailNotification(email);

  async function resendConfirmationEmail(email: string) {
    // clear the confirmationEmailSent cookie
    cookieStore.delete('confirmationEmailSent');
    // send the email again
    await subscribeEmailNotification(email);
  }
  return (
    <SubscriptionForm email={email} resendConfirmationEmail={resendConfirmationEmail} />
  )
}