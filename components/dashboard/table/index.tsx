import React from 'react'

import { Task } from "@/types/task";
import { getTasks } from "@/libs/actions";

import { columns } from './columns';
import { DataTable } from './data-table';

export default async function Table() {
  const tasks: Task[] = await getTasks();

  return (
    <div className="w-full px-4 lg:px-6">
      <DataTable columns={columns} data={tasks} />
    </div>
  )
}
