import { getAuthenticatedUser } from "@/app/lib/actions"
export default async function Overview() {
  const { isAuthenticated, user } = await getAuthenticatedUser();
  if (!isAuthenticated || !user) return null;
  const { name } = user;
  return (
    <div className='flex justify-between item-center'>
      <p>Welcome Back <span className='font-bold'>{name}</span>! Let&apos;s create more tasks here!</p>
    </div>
  )
}