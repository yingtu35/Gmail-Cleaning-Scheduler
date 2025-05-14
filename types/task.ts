import { z } from 'zod';
import { formValuesSchema, PromptSchema, AIFormValuesSchema } from '@/validations/form';

/**
 * Defines the type of a task in the database.
 * 
 * This type is used to represent a task that has been created by a user.
 */
export type Task = {
  id?: string;
  scheduleName: string;
  createdAt?: Date;
  updatedAt?: Date;
  expiresAt: Date | null;
  repeatCount?: number;
  formValues: FormValues;
  userId: string;
}

export type FormValues = z.infer<typeof formValuesSchema>

export type AIPromptType = z.infer<typeof PromptSchema>;

export type AIFormValues = z.infer<typeof AIFormValuesSchema>

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
