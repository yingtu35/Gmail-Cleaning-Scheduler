import { z } from 'zod';

import { UserTasksTable, taskStatusEnum } from '@/models/schema';
import { formValuesSchema, PromptSchema, AIFormValuesSchema } from '@/validations/form';

export type Task = typeof UserTasksTable.$inferSelect;

export type NewTask = typeof UserTasksTable.$inferInsert;

export type TaskStatus = (typeof taskStatusEnum)[keyof typeof taskStatusEnum] | null;

export type NextScheduledTask = Pick<Task, "id" | "nextExecutedAt" | "formValues">;

export type FormValues = z.infer<typeof formValuesSchema>;

export type AIPromptType = z.infer<typeof PromptSchema>;

export type AIFormValues = z.infer<typeof AIFormValuesSchema>;

export type TimeValue = {
  comparison: "after" | "before";
  value: Date;
}

export type AgeValue = {
  comparison: "older than" | "newer than";
  unit: "days" | "months" | "years";
  value: number;
}

export type SizeValue = {
  comparison: "greater than" | "less than";
  unit: "Bytes" | "KB" | "MB";
  value: number;
}
