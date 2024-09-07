import { FormValues, Task as TaskType } from "@/app/lib/definitions";
import { getTaskById } from "@/app/lib/actions";
import EditForm from "@/app/components/tasks/edit-form";

export default async function Page({
  params
}: {
  params: {
    taskId: string;
  }
}) {
  const task: TaskType | null = await getTaskById(params.taskId);
  if (!task) {
    return <div>Task not found</div>
  }
  const formValues: FormValues = task.formValues
  return (
    <EditForm task={formValues} taskId={params.taskId} />
  )
}