// This file contains all initial data for the form.
import {
  FormValues,
  AIPromptValues
} from '@/app/lib/definitions';

export const INITIAL_STATE: FormValues = {
  name: '',
  description: '',
  occurrence: {
    Occurrence: 'One-time',
    TimeZone: 'America/Los_Angeles',
    Schedule: {
      date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: '00:00',
    },
  },
  from: {
    enabled: false,
    from: '',
  },
  to: {
    enabled: false,
    to: '',
  },
  title: {
    enabled: false,
    title: '',
  },
  emailIs: {
    enabled: true,
    emailIs: ["unread"],
  },
  doesntHave: {
    enabled: false,
    doesntHave: '',
  },
  has: {
    enabled: false,
    has: [],
  },
  labels: {
    enabled: false,
    labels: '',
  },
  category: {
    enabled: false,
    category: [],
  },
  size: {
    enabled: false,
    size: {
      comparison: 'greater than',
      value: 1,
      unit: 'MB'
    }
  },
  age: {
    enabled: false,
    age: {
      comparison: 'older than',
      value: 3,
      unit: 'months'
    }
  },
  time: {
    enabled: false,
    time: {
      comparison: 'before',
      value: new Date(Date.now() - 3 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }
  },
  emailIn: {
    enabled: true,
    emailIn: ["inbox"],
  },
}

const INITIAL_AI_STATE: AIPromptValues = {
  taskPrompt: 'emails from John Doe, and sizes greater than 1MB',
  schedulePrompt: {
    isOneTime: false,
    oneTimePrompt: '3 days from now',
    recurringPrompt: 'starting from next month, and ending in 6 months'
  }
}

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