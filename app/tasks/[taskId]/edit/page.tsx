import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { FormValues, Task as TaskType } from "@/types/task";
import { getTaskById } from "@/actions/task";
import EditForm from "@/components/task/form/edit-form";

import { mockTasks } from "@/mocks/mock-task";

async function getMockTask(): Promise<TaskType> {
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
  const session = await auth();
  const task: TaskType | null = await getTaskById(params.taskId);
  // const task: TaskType | null = await getMockTask();
  if (!session) {
    redirect("/login");
  }
  if (!task) {
    return <div>Task not found</div>
  }
  const formValues: FormValues = task.formValues
  return (
    <EditForm 
      task={formValues} 
      taskId={params.taskId} 
      session={session}
    />
  )
}