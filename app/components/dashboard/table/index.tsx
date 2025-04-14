import React from 'react'
import { Task } from "@/app/lib/definitions";
import { getTasks } from "@/app/lib/actions";

import { columns } from './columns';
import { DataTable } from './data-table';

export default async function Table() {
  const tasks: Task[] = await getTasks();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={tasks} />
    </div>
  )
}
