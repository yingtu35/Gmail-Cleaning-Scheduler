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
    <div className='flex flex-col grow gap-4'>
      <Overview />
      <Suspense fallback={
        <div className="flex items-center justify-center w-full h-32">
          <LoadingSpinner />
        </div>
      }>
        <Table />
      </Suspense>
    </div>
  )
}
