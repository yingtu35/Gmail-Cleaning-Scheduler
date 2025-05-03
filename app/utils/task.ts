import { Task } from "../lib/definitions";
import { parseJsonToFormValues } from "./schedule";

type TaskFromDB = {
  formValues: unknown;
  id: string;
  repeatCount: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  scheduleName: string;
  expiresAt: Date | null;
  userId: string;
}

export function parseTask(task: TaskFromDB): Task {
  return {
    ...task,
    createdAt: task.createdAt || undefined,
    updatedAt: task.updatedAt || undefined,
    expiresAt: task.expiresAt || null,
    repeatCount: task.repeatCount || 0,
    formValues: parseJsonToFormValues(JSON.stringify(task.formValues)),
  }
}