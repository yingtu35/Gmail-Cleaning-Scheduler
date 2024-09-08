import React, { Suspense } from 'react'
import TaskTable from '../tasks/table'

export default function Dashboard() {
  return (
    <div className='flex flex-col items-center'>
      <div>Statistics</div>
      <div>Charts</div>
      <Suspense fallback={<div>Loading...</div>}>
        <TaskTable />
      </Suspense>
    </div>
  )
}
