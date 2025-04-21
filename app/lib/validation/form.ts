import { z } from 'zod';

// primitive enums
const SizeComparison = z.enum(['greater than', 'less than'] as const);
const SizeUnit       = z.enum(['MB', 'KB', 'Bytes'] as const);
const AgeComparison  = z.enum(['older than', 'newer than'] as const);
const AgeUnit        = z.enum(['days', 'months', 'years'] as const);
const TimeComparison = z.enum(['after', 'before'] as const);
const RateUnit       = z.enum(['minutes', 'hours', 'days'] as const);
const EmailIsEnum    = z.enum(['unread', 'read', 'starred', 'important'] as const);
const HasEnum        = z.enum([
  'attachment','drive','document','spreadsheet','presentation','image','video'
] as const);
const CategoryEnum   = z.enum([
  'primary','social','promotions','updates','forums','reservations','purchases'
] as const);
const EmailInEnum    = z.enum(['inbox', 'draft', 'sent', 'chats', 'scheduled'] as const);

// schedule schemas
const OneTimeScheduleSchema = z.object({ date: z.date(), time: z.string() }).required();
const RecurringScheduleSchema = z.object({
  rate: z.object({ value: z.number(), unit: RateUnit }).required(),
  startDate: z.date(),
  startTime: z.string(),
  endDate: z.date(),
  endTime: z.string(),
})
// validate that start date and time is before end date and time
.superRefine((obj, ctx) => {
  const { startDate, startTime, endDate, endTime } = obj; 
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
const FromSchema        = z.object({ enabled: z.boolean(), from: z.string() });
const ToSchema          = z.object({ enabled: z.boolean(), to: z.string() });
const TitleSchema       = z.object({ enabled: z.boolean(), title: z.string() });
const EmailIsSchema     = z.object({ enabled: z.boolean(), emailIs: EmailIsEnum.array() });
const DoesntHaveSchema  = z.object({ enabled: z.boolean(), doesntHave: z.string() });
const HasSchema         = z.object({ enabled: z.boolean(), has: HasEnum.array() });
const LabelsSchema      = z.object({ enabled: z.boolean(), labels: z.string() });
const CategorySchema    = z.object({ enabled: z.boolean(), category: CategoryEnum.array() });
const SizeSchema        = z.object({
  enabled: z.boolean(),
  size: z.object({ comparison: SizeComparison, value: z.number(), unit: SizeUnit }),
});
const AgeSchema         = z.object({
  enabled: z.boolean(),
  age: z.object({ comparison: AgeComparison, value: z.number(), unit: AgeUnit }),
});
const TimeSchemaField   = z.object({
  enabled: z.boolean(),
  time: z.object({ comparison: TimeComparison, value: z.string() }),
});
const EmailInSchema     = z.object({ enabled: z.boolean(), emailIn: EmailInEnum.array() });

// main form schema
export const formValuesSchema = z.object({
  // name should use only letters, numbers, dashes, dots or underscores. Max 64 characters.
  name:        z.string()
                .min(1, "Name is required.")
                .max(64, "Name should be less than 64 characters.")
                .regex(/^[a-zA-Z0-9._-]+$/, "Name should only contain letters, numbers, dashes, dots or underscores."),
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