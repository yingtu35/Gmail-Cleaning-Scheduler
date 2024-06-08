import { Task } from "@/app/lib/definitions";
import { getTaskById } from "@/app/lib/actions";

import TaskCard from "@/app/components/tasks/card";

export default async function Page({
  params
}: {
  params: {
    taskId: string;
  }
}) {
  const task: Task | null = await getTaskById(params.taskId);
  if (!task) {
    return <div>Task not found</div>
  }
  return (
    <div>
      <TaskCard key={task.id} task={task} />
    </div>
  )
}