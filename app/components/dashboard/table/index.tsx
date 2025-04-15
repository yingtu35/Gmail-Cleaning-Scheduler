import React from 'react'
import { Task } from "@/app/lib/definitions";
import { getTasks } from "@/app/lib/actions";
import { mockTasks } from '@/app/data/mock-task';

import { columns } from './columns';
import { DataTable } from './data-table';

async function getMockTasks() {
  await new Promise(resolve => setTimeout(resolve, 2000));
  return mockTasks;
}

export default async function Table() {
  const tasks: Task[] = await getTasks();
  // const tasks = await getMockTasks();

  return (
    <div className="w-full px-4 lg:px-6">
      <DataTable columns={columns} data={tasks} />
    </div>
  )
}
