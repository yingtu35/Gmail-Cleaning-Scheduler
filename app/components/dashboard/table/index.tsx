import React from 'react'
import { Task } from "@/app/lib/definitions";
import { getTasks } from "@/app/lib/actions";
import TaskTable from "./TaskTable";
import { TOO_MANY_TASKS } from "./mockTasks";

export default async function Table() {
  const tasks: Task[] = await getTasks();
  if (tasks.length === 0) {
    tasks.push(...TOO_MANY_TASKS);
  }

  return (
    <TaskTable tasks={tasks} />
  )
}
