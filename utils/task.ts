import { Task } from "@/types/task";
import { parseJsonToFormValues } from "./schedule";

export function parseTask(task: Task): Task {
  return {
    ...task,
    formValues: parseJsonToFormValues(JSON.stringify(task.formValues)),
  }
}