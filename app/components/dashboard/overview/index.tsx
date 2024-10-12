import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getAuthenticatedUser } from "@/app/lib/actions"
export default async function Overview() {
  const { isAuthenticated, user } = await getAuthenticatedUser();
  if (!isAuthenticated || !user) return null;
  const { name } = user;
  return (
    <div className='flex justify-between item-center'>
      <p>Welcome Back <span className='font-bold'>{name}</span>! Let&apos;s create more tasks here!</p>
      <Button className='mb-4' variant='default'>
        <Link href='/tasks/create'>Create Task</Link>
      </Button>
    </div>
  )
}