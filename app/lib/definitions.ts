// This file contains type definitions for the data.
// It describes the shape of the data, and what data type each property should accept.

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
  createdAt?: Date;
  updatedAt?: Date;
  expiresAt: Date | null;
  repeatCount?: number;
  formValues: FormValues;
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
  TimeZone: string;
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

export type EmailIsValue = "unread" | "read" | "starred" | "important";
export type EmailIsType = {
  enabled: boolean;
  emailIs: EmailIsValue[];
}

export type DoesntHaveType = {
  enabled: boolean;
  doesntHave: string;
}

export type HasValue = "attachment" | "drive" | "document" | "spreadsheet" | "presentation" | "image" | "video";
export type HasType = {
  enabled: boolean;
  has: HasValue[];
}

export type LabelsType = {
  enabled: boolean;
  labels: string;
}

export type CategoryValue = "primary" | "social" | "promotions" | "updates" | "forums" | "reservations" | "purchases";
export type CategoryType = {
  enabled: boolean;
  category: CategoryValue[];
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

export type EmailInValue = "inbox" | "draft" | "sent" | "chats" | "scheduled";
export type EmailInType = {
  enabled: boolean;
  emailIn: EmailInValue[];
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
  has?: HasType;
  labels?: LabelsType;
  category?: CategoryType;
  size?: SizeType;
  age?: AgeType;
  time?: TimeType;
  emailIn?: EmailInType;
}

export type LambdaInput = {
  email: string;
  access_token: string;
  refresh_token: string;
  expires_at: string;
  q: string;
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

export type AIPromptValues = {
  taskPrompt: string;
  schedulePrompt: SchedulePromptType;
}