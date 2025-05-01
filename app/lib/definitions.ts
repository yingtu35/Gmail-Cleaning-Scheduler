// This file contains type definitions for the data.
// It describes the shape of the data, and what data type each property should accept.
import { z } from 'zod';
import { formValuesSchema, PromptSchema, AIFormValuesSchema } from './validation/form';

export type UserIconType = {
  name: string;
  avatarUrl: string;
  htmlUrl: string;
}

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

export type Task = {
  id?: string;
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

export type SchedulePromptType = {
  isOneTime: boolean;
  oneTimePrompt: string;
  recurringPrompt: string;
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