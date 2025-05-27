import { z } from 'zod';

export const SIZE_COMPARISON_ENUM = ['greater than', 'less than'] as const;
export const SIZE_UNIT_ENUM       = ['MB', 'KB', 'Bytes'] as const;
export const AGE_COMPARISON_ENUM  = ['older than', 'newer than'] as const;
export const AGE_UNIT_ENUM        = ['days', 'months', 'years'] as const;
export const TIME_COMPARISON_ENUM = ['after', 'before'] as const;
export const RATE_UNIT_ENUM       = ['minutes', 'hours', 'days'] as const;
export const EMAIL_IS_ENUM        = ['unread', 'read', 'starred', 'important'] as const;
export const HAS_ENUM             = [
  'attachment','drive','document','spreadsheet','presentation','image','video'
] as const;
export const CATEGORY_ENUM       = [
  'primary','social','promotions','updates','forums','reservations','purchases'
] as const;
export const EMAIL_IN_ENUM        = ['inbox', 'draft', 'sent', 'chats', 'scheduled'] as const;

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
  rate: z.object({ value: z.coerce.number().min(1).max(365), unit: RateUnit }).required(),
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
const FromSchema        = z.object({ enabled: z.boolean(), from: z.string().array() })
  .superRefine((data, ctx) => {
    if (data.enabled && data.from.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['from'],
        message: "Please specify at least one email address.",
      });
    }
  });
const ToSchema          = z.object({ enabled: z.boolean(), to: z.string().array() })
  .superRefine((data, ctx) => {
    if (data.enabled && data.to.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['to'],
        message: "Please specify at least one email address.",
      });
    }
  });
const TitleSchema       = z.object({ enabled: z.boolean(), title: z.string().array() })
  .superRefine((data, ctx) => {
    if (data.enabled && data.title.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['title'],
        message: "Please specify at least one title.",
      });
    }
  });
const EmailIsSchema     = z.object({ enabled: z.boolean(), emailIs: EmailIsEnum.array() })
  .superRefine((data, ctx) => {
    if (data.enabled && data.emailIs.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['emailIs'],
        message: "Please select at least one status.",
      });
    }
  });
const DoesntHaveSchema  = z.object({ enabled: z.boolean(), doesntHave: z.string().array() })
  .superRefine((data, ctx) => {
    if (data.enabled && data.doesntHave.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['doesntHave'],
        message: "Please specify at least one term.",
      });
    }
  });
const HasSchema         = z.object({ enabled: z.boolean(), has: HasEnum.array() })
  .superRefine((data, ctx) => {
    if (data.enabled && data.has.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['has'],
        message: "Please select at least one content type.",
      });
    }
  });
const LabelsSchema      = z.object({ enabled: z.boolean(), labels: z.string().array() })
  .superRefine((data, ctx) => {
    if (data.enabled && data.labels.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['labels'],
        message: "Please specify at least one label.",
      });
    }
  });
const CategorySchema    = z.object({ enabled: z.boolean(), category: CategoryEnum.array() })
  .superRefine((data, ctx) => {
    if (data.enabled && data.category.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['category'],
        message: "Please select at least one category.",
      });
    }
  });
const SizeSchema        = z.object({
  enabled: z.boolean(),
  size: z.object({ comparison: SizeComparison, value: z.coerce.number().min(1), unit: SizeUnit }),
});
const AgeSchema         = z.object({
  enabled: z.boolean(),
  age: z.object({ comparison: AgeComparison, value: z.coerce.number().min(1), unit: AgeUnit }),
});
const TimeSchemaField   = z.object({
  enabled: z.boolean(),
  time: z.object({ comparison: TimeComparison, value: z.date() }),
});
const EmailInSchema     = z.object({ enabled: z.boolean(), emailIn: EmailInEnum.array() })
  .superRefine((data, ctx) => {
    if (data.enabled && data.emailIn.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['emailIn'],
        message: "When 'Email In' filter is enabled, please select at least one location.",
      });
    }
  });

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
}).superRefine((data, ctx) => {
  const conditions = [
    data.from,
    data.to,
    data.title,
    data.emailIs,
    data.doesntHave,
    data.has,
    data.labels,
    data.category,
    data.size,
    data.age,
    data.time,
    data.emailIn,
  ];

  const isAtLeastOneEnabled = conditions.some(condition => condition && condition.enabled);

  if (!isAtLeastOneEnabled) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["_taskConditions"], // Use a virtual path for the error
      message: "At least one filter condition (e.g., From, To, Size, etc.) must be enabled",
    });
  }
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