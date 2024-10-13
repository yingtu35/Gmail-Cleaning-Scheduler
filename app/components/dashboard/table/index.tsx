import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Task } from "@/app/lib/definitions";
import { getTasks } from "@/app/lib/actions";
import TaskTable from "./TaskTable";
import { MAX_TASKS_COUNT } from '@/app/constants/createTask';
import { hasReachedTaskLimit } from '@/app/utils/database';

export default async function Table() {
  const tasks: Task[] = await getTasks();

  return (
    <>
      <Button className='mb-4' variant='default' disabled={hasReachedTaskLimit(tasks.length)}>
        <Link href='/tasks/create'>Create Task ({tasks.length}/{MAX_TASKS_COUNT.FREE})</Link>
      </Button>
      <TaskTable tasks={tasks} />
    </>
  )
}
