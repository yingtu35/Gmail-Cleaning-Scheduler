import React, { Suspense } from 'react'
import { auth } from "@/auth"
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import Table from './table'


export default async function Dashboard() {
  const session = await auth();
  const user = session?.user;
  if (!user) return null;

  return (
    <div className='flex flex-col grow m-4'>
      <div>Overview</div>
      <div>
        <Button className='mb-4' variant='default'>
          <Link href='/tasks/create'>Create Task</Link>
        </Button>
        <Suspense fallback={<div>Loading...</div>}>
          <Table />
        </Suspense>
      </div>
    </div>
  )
}
