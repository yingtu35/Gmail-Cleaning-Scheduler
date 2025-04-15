import React, { Suspense } from 'react'
import { auth } from "@/auth"
import Table from './table'
import Overview from './overview';
import { LoadingSpinner } from '@/components/ui/loadingSpinner';


export default async function Dashboard() {
  const session = await auth();
  const user = session?.user;
  if (!user) return null;

  return (
    <div className='flex flex-col grow m-4 gap-4'>
      <Overview />
      <Suspense fallback={<LoadingSpinner className="m-auto" />}>
        <Table />
      </Suspense>
    </div>
  )
}
