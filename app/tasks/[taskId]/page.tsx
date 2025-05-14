import { Task as TaskType } from "@/app/lib/definitions";
import { getTaskById } from "@/app/lib/actions";
import Task from "@/components/task/task";
export default async function Page({
  params
}: {
  params: {
    taskId: string;
  }
}) {
  const task: TaskType | null = await getTaskById(params.taskId);
  if (!task || !task.id) {
    return <div>Task not found</div>
  }
  return (
    <Task task={task} />
  )
}