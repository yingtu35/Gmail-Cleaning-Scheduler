"use client"

import { FormValues, Task as TaskType } from "@/app/lib/definitions"
import { Button } from '@/app/components/button'
import { ScheduleDetail, TaskDetail } from './reviewForm'
import Link from "next/link"
import { deleteTask } from "@/app/lib/actions"

export default function Task({ task }: { task: TaskType }) {
  if (!task) {
    return <div>Task not found</div>
  }
  if (!task.id) {
    return <div>Task ID not found</div>
  }
  const formValues: FormValues = task.formValues
  const aggregatedEntries = Object.entries(formValues)
  // extract the first 3 entries
  const scheduleEntries = aggregatedEntries.slice(0, 3)
  const taskEntries = aggregatedEntries.slice(3)

  const onDeleteTask = async () => {
    if (confirm('Are you sure you want to delete this task?')) {
      await deleteTask(task.id as string)
    }
  }
  return (
    <div className="space-y-4">
      <div className="flex justify-end items-center">
        <Link href={`/tasks/${task.id}/edit`}>
          <Button>
            Edit
          </Button>
        </Link>
        <Button onClick={onDeleteTask}>Delete</Button>
      </div>
      <ScheduleDetail scheduleEntries={scheduleEntries} />
      <TaskDetail taskEntries={taskEntries} formValues={formValues} />
    </div>
  )
}