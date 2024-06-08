// This file contains type definitions for the data.
// It describes the shape of the data, and what data type each property should accept.

import { One } from "drizzle-orm";

export type UserIconType = {
  name: string;
  avatarUrl: string;
  htmlUrl: string;
}

export type UserInDB = {
  id?: string;
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
  title: string;
  description?: string;
  tasks: string;
  createdAt?: Date;
  updatedAt?: Date;
  isRepeatable: boolean;
  repeatInterval?: string;
  repeatCount?: number;
  userId: string;
}

export type SizeComparison = 'greater than' | 'less than';
export type SizeUnit = 'MB' | 'KB' | 'Bytes';
export type SizeValue = {
  comparison: SizeComparison;
  value: number;
  unit: SizeUnit;
}

export type AgeUnit = 'days' | 'months' | 'years';
export type AgeComparison = 'older than' | 'newer than';
export type AgeValue = {
  comparison: AgeComparison;
  value: number;
  unit: AgeUnit;
}

export type TimeComparison = 'after' | 'before';
export type TimeValue = {
  comparison: TimeComparison;
  value: string;
}

export type TimeZone = 'PST' | 'MST' | 'CST' | 'EST';

export type OneTimeSchedule = {
  date: string;
  time: string;
}
export type rateUnit = 'minutes' | 'hours' | 'days';
export type rateValue = {
  value: number;
  unit: rateUnit;
}
export type RecurringSchedule = {
  rate: rateValue;
  startDate: string;
  endDate: string;
}
export type OccurenceValue = 'One-time' | 'Recurring';
export type OccurrenceType = {
  Occurrence: OccurenceValue;
  TimeZone: TimeZone;
  Schedule: OneTimeSchedule | RecurringSchedule;
  temp?: OneTimeSchedule | RecurringSchedule;
}

export type FromType = {
  enabled: boolean;
  from: string;
}

export type ToType = {
  enabled: boolean;
  to: string;
}

export type TitleType = {
  enabled: boolean;
  title: string;
}

export type EmailIsType = {
  enabled: boolean;
  emailIs: string[];
}

export type DoesntHaveType = {
  enabled: boolean;
  doesntHave: string;
}

export type HasType = {
  enabled: boolean;
  has: string[];
}

export type LabelsType = {
  enabled: boolean;
  labels: string;
}

export type CategoryType = {
  enabled: boolean;
  category: string[];
}

export type SizeType = {
  enabled: boolean;
  size: SizeValue;
}

export type AgeType = {
  enabled: boolean;
  age: AgeValue;
}

export type TimeType = {
  enabled: boolean;
  time: TimeValue;
}

export type EmailInType = {
  enabled: boolean;
  emailIn: string[];
}

export type FormValues = {
  name: string;
  description: string;
  occurrence: OccurrenceType;
  from: FromType;
  to: ToType;
  title: TitleType;
  emailIs: EmailIsType;
  doesntHave: DoesntHaveType;
  has: HasType;
  labels: LabelsType;
  category: CategoryType;
  size: SizeType;
  age: AgeType;
  time: TimeType;
  emailIn: EmailInType;
}