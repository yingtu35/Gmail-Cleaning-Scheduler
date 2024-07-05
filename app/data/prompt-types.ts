// This file contains all initial data for the form.
export const PROMPT_TYPES = `type SizeComparison = 'greater than' | 'less than';
type SizeUnit = 'MB' | 'KB' | 'Bytes';
type SizeValue = {
  comparison: SizeComparison;
  value: number;
  unit: SizeUnit;
}

type AgeUnit = 'days' | 'months' | 'years';
type AgeComparison = 'older than' | 'newer than';
type AgeValue = {
  comparison: AgeComparison;
  value: number;
  unit: AgeUnit;
}

type TimeComparison = 'after' | 'before';
type TimeValue = {
  comparison: TimeComparison;
  value: string;
}

type OneTimeSchedule = {
  date: string;
  time: string;
}
type rateUnit = 'minutes' | 'hours' | 'days';
type rateValue = {
  value: number;
  unit: rateUnit;
}
type RecurringSchedule = {
  rate: rateValue;
  startDate: string;
  endDate: string;
}
type OccurenceValue = 'One-time' | 'Recurring';
type OccurrenceType = {
  Occurrence: OccurenceValue;
  TimeZone: string;
  Schedule: OneTimeSchedule | RecurringSchedule;
  temp?: OneTimeSchedule | RecurringSchedule;
}

type FromType = {
  enabled: boolean;
  from: string;
}

type ToType = {
  enabled: boolean;
  to: string;
}

type TitleType = {
  enabled: boolean;
  title: string;
}

type EmailIsType = {
  enabled: boolean;
  emailIs: string[];
}

type DoesntHaveType = {
  enabled: boolean;
  doesntHave: string;
}

type HasType = {
  enabled: boolean;
  has: string[];
}

type LabelsType = {
  enabled: boolean;
  labels: string;
}

type CategoryType = {
  enabled: boolean;
  category: string[];
}

type SizeType = {
  enabled: boolean;
  size: SizeValue;
}

type AgeType = {
  enabled: boolean;
  age: AgeValue;
}

type TimeType = {
  enabled: boolean;
  time: TimeValue;
}

type EmailInType = {
  enabled: boolean;
  emailIn: string[];
}

type FormValues = {
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
}`