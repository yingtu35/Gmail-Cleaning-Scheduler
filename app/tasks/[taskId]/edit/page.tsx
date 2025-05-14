import { FormValues, Task as TaskType } from "@/app/lib/definitions";
import { getTaskById } from "@/app/lib/actions";
import EditForm from "@/components/task/form/edit-form";

import { mockTasks } from "@/app/data/mock-task";

async function getMockTask() {
  await new Promise(resolve => setTimeout(resolve, 2000));
  return mockTasks[0];
}

export default async function Page({
  params
}: {
  params: {
    taskId: string;
  }
}) {
  const task: TaskType | null = await getTaskById(params.taskId);
  // const task: TaskType | null = await getMockTask();
  if (!task) {
    return <div>Task not found</div>
  }
  const formValues: FormValues = task.formValues
  return (
    <EditForm task={formValues} taskId={params.taskId} />
  )
}