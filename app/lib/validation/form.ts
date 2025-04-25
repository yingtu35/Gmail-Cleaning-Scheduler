import { z } from 'zod';

import {
  SIZE_COMPARISON_ENUM,
  SIZE_UNIT_ENUM,
  AGE_COMPARISON_ENUM,
  AGE_UNIT_ENUM,
  TIME_COMPARISON_ENUM,
  RATE_UNIT_ENUM,
  EMAIL_IS_ENUM,
  HAS_ENUM,
  CATEGORY_ENUM,
  EMAIL_IN_ENUM,
} from '@/app/constants/formValues';

// primitive enums
const SizeComparison = z.enum(SIZE_COMPARISON_ENUM);
const SizeUnit       = z.enum(SIZE_UNIT_ENUM);
const AgeComparison  = z.enum(AGE_COMPARISON_ENUM);
const AgeUnit        = z.enum(AGE_UNIT_ENUM);
const TimeComparison = z.enum(TIME_COMPARISON_ENUM);
const RateUnit       = z.enum(RATE_UNIT_ENUM);
const EmailIsEnum    = z.enum(EMAIL_IS_ENUM);
const HasEnum        = z.enum(HAS_ENUM);
const CategoryEnum   = z.enum(CATEGORY_ENUM);
const EmailInEnum    = z.enum(EMAIL_IN_ENUM);

// schedule schemas
const OneTimeScheduleSchema = z.object({ date: z.date(), time: z.string() }).required();
const RecurringScheduleSchema = z.object({
  rate: z.object({ value: z.coerce.number(), unit: RateUnit }).required(),
  startDateAndTime: z.object({ date: z.date(), time: z.string() }),
  endDateAndTime: z.object({ date: z.date(), time: z.string() }),
}).superRefine((obj, ctx) => {
  const { startDateAndTime, endDateAndTime } = obj; 
  const { date: startDate, time: startTime } = startDateAndTime;
  const { date: endDate, time: endTime } = endDateAndTime;
  const [sh, sm] = startTime.split(':').map(Number);
  const [eh, em] = endTime.split(':').map(Number);
  const startTs = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate(),
    sh,
    sm
  ).getTime();
  const endTs = new Date(
    endDate.getFullYear(),
    endDate.getMonth(),
    endDate.getDate(),
    eh,
    em
  ).getTime();
  if (endTs <= startTs) {
    if (endDate.getTime() < startDate.getTime()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['endDate'],
        message: 'End date must be after start date',
      });
    } else {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['endTime'],
        message: 'End time must be after start time',
      });
    }
  }
});

// replace OccurrenceSchema with discriminated union
const OccurrenceOneTimeSchema = z.object({
  Occurrence: z.literal('One-time'),
  TimeZone: z.string(),
  Schedule: OneTimeScheduleSchema,
});
const OccurrenceRecurringSchema = z.object({
  Occurrence: z.literal('Recurring'),
  TimeZone: z.string(),
  Schedule: RecurringScheduleSchema,
});
const OccurrenceSchema = z.discriminatedUnion('Occurrence', [
  OccurrenceOneTimeSchema,
  OccurrenceRecurringSchema,
]);

// field schemas
const FromSchema        = z.object({ enabled: z.boolean(), from: z.string().array() });
const ToSchema          = z.object({ enabled: z.boolean(), to: z.string().array() });
const TitleSchema       = z.object({ enabled: z.boolean(), title: z.string().array() });
const EmailIsSchema     = z.object({ enabled: z.boolean(), emailIs: EmailIsEnum.array() });
const DoesntHaveSchema  = z.object({ enabled: z.boolean(), doesntHave: z.string().array() });
const HasSchema         = z.object({ enabled: z.boolean(), has: HasEnum.array() });
const LabelsSchema      = z.object({ enabled: z.boolean(), labels: z.string().array() });
const CategorySchema    = z.object({ enabled: z.boolean(), category: CategoryEnum.array() });
const SizeSchema        = z.object({
  enabled: z.boolean(),
  size: z.object({ comparison: SizeComparison, value: z.coerce.number(), unit: SizeUnit }),
});
const AgeSchema         = z.object({
  enabled: z.boolean(),
  age: z.object({ comparison: AgeComparison, value: z.coerce.number(), unit: AgeUnit }),
});
const TimeSchemaField   = z.object({
  enabled: z.boolean(),
  time: z.object({ comparison: TimeComparison, value: z.date() }),
});
const EmailInSchema     = z.object({ enabled: z.boolean(), emailIn: EmailInEnum.array() });

// main form schema
export const formValuesSchema = z.object({
  // name should use only letters, numbers, dashes, dots, underscores or spaces. Max 64 characters.
  name:        z.string()
                .min(1, "Name is required.")
                .max(64, "Name should be less than 64 characters.")
                .regex(/^[a-zA-Z0-9._\-\s]+$/, "Name should only contain letters, numbers, dashes, dots, underscores or spaces."),
  description: z.string()
                .max(512, "Description should be less than 512 characters.")
                .optional(),
  occurrence:  OccurrenceSchema,
  from:        FromSchema,
  to:          ToSchema,
  title:       TitleSchema,
  emailIs:     EmailIsSchema,
  doesntHave:  DoesntHaveSchema,
  has:         HasSchema,
  labels:      LabelsSchema,
  category:    CategorySchema,
  size:        SizeSchema,
  age:         AgeSchema,
  time:        TimeSchemaField,
  emailIn:     EmailInSchema,
});

const ScheduleOneTimeSchema = z.object({
  Occurrence: z.literal('One-time'),
  Prompt: z.string()
    .min(1, "Task prompt is required.")
    .max(512, "Task prompt should be less than 512 characters."),
});
const ScheduleRecurringSchema = z.object({
  Occurrence: z.literal('Recurring'),
  Prompt: z.string()
    .min(1, "Task prompt is required.")
    .max(512, "Task prompt should be less than 512 characters."),
});

const SchedulePromptSchema = z.discriminatedUnion('Occurrence', [
  ScheduleOneTimeSchema,
  ScheduleRecurringSchema,
]);

export const PromptSchema = z.object({
  taskPrompt : z.string()
    .min(1, "Task prompt is required.")
    .max(512, "Task prompt should be less than 512 characters."),
  schedulePrompt: SchedulePromptSchema,
})

export const AIFormValuesSchema = z.object({
  prompt: PromptSchema,
  formValues: z.object({
    isGenerated: z.boolean({
      required_error: "Please generate a schedule first.",
      invalid_type_error: "Unexpected error occurred. Please try again.",
    }),
    value: formValuesSchema,
  }),
});