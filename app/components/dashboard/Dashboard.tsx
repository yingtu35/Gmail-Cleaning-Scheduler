import React, { Suspense } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import TaskTable from '../tasks/table'


export default function Dashboard() {
  return (
    <div className='grid grid-col-2 grow'>
      <div>Statistics</div>
      <div>Charts</div>
      <div className='col-span-2'>
        <Button className='mb-4' variant='default'>
          <Link href='/tasks/create'>Create Task</Link>
        </Button>
        <Suspense fallback={<div>Loading...</div>}>
          <TaskTable />
        </Suspense>
      </div>
    </div>
  )
}
