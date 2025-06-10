import { Task as TaskType } from "@/types/task";
import { getTaskById } from "@/actions/task";
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