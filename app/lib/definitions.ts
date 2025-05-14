// This file contains type definitions for the data.
// It describes the shape of the data, and what data type each property should accept.
import { z } from 'zod';
import { formValuesSchema, PromptSchema, AIFormValuesSchema } from '@/validations/form';

export type UserGoogle = {
  name: string;
  email: string;
  image: string;
  accessToken: string;
  expiresAt: Date;
  refreshToken: string | undefined;
}

export type UserInDB = {
  id: string;
  name: string;
  email: string;
  image: string;
  accessToken: string;
  expiresAt: Date;
  refreshToken: string | undefined;
  createdAt?: Date;
}

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

export type LambdaInput = {
  email: string;
  access_token: string;
  refresh_token: string;
  expires_at: string;
  q: string;
  task_name: string;
}

export type CommandInput = {
  name: string;
  scheduleExpression: string;
  description: string;
  startDate?: Date;
  endDate?: Date;
  scheduleExpressionTimezone: string;
  state: string;
  input: string;
}

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

export type UserDateTimePromptType = {
  date: string;
  time: string;
  timezone: string;
}