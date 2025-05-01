import { UserInDB, FormValues, CommandInput, LambdaInput, TimeValue, AgeValue, SizeValue } from "@/app/lib/definitions"
import moment from "moment-timezone";
import { 
  convertDateStringToDate, 
  isStringDateFormat, 
  convertDateToString, 
  convertDateToAWSString
} from "./date";

function formatArrayField(key: string, fieldValue: any[]): string {
  const query = fieldValue.map(value => `${key}:${value.trim()}`).join(' ');
  return `{${query}}`;
}

function formatExcludedField(key: string, fieldValue: any[]): string {
  const query = fieldValue.map(value => `${key}${value.trim()}`).join(' ');
  return `(${query})`;
}

function formatStringField(key: string, fieldValue: string): string {
  const values = fieldValue.split(',');
  return values.map(value => `${key}:${value.trim()}`).join(' OR ');
}

function formatSizeField(fieldValue: SizeValue): string {
  const comparison = fieldValue.comparison === 'greater than' ? 'larger' : 'smaller';
  let unitSuffix = '';
  switch (fieldValue.unit) {
      case 'MB':
          unitSuffix = 'M';
          break;
      case 'KB':
          unitSuffix = 'K';
          break;
      case 'Bytes':
          unitSuffix = '';
          break;
  }
  return `${comparison}:${fieldValue.value}${unitSuffix}`;
}

function formatAgeField(fieldValue: AgeValue): string {
  const comparison = fieldValue.comparison === 'older than' ? 'older_than' : 'newer_than';
  let unitSuffix = '';
  switch (fieldValue.unit) {
      case 'days':
          unitSuffix = 'd';
          break;
      case 'months':
          unitSuffix = 'm';
          break;
      case 'years':
          unitSuffix = 'y';
          break;
  }
  return `${comparison}:${fieldValue.value}${unitSuffix}`;
}

function formatTimeField(fieldValue: TimeValue): string {
  const formattedDateString = convertDateToString(fieldValue.value);
  return `${fieldValue.comparison}:${formattedDateString}`;
}

type Field<T> = { enabled: boolean; } & { [key: string]: T | boolean; };

export function formatFields(jsonObj: FormValues): string {
  const resultArray: string[] = [];

  function processField<T>(key: string, field: Field<T>, formatter: (fieldValue: T) => string) {
      if (field.enabled) {
          const fieldValue = field[key];
          if (typeof fieldValue !== 'boolean') {
            const formattedString = formatter(fieldValue);
            resultArray.push(`${formattedString}`);
          }
      }
  }

  processField('from', jsonObj.from, value => formatArrayField('from', value));
  processField('to', jsonObj.to, value => formatArrayField('to', value));
  processField('title', jsonObj.title, value => formatArrayField('title', value));
  processField('emailIs', jsonObj.emailIs, value => formatArrayField('is', value));
  processField('doesntHave', jsonObj.doesntHave, value => formatExcludedField('-', value));
  processField('has', jsonObj.has, value => formatArrayField('has', value));
  processField('labels', jsonObj.labels, value => formatArrayField('label', value));
  processField('category', jsonObj.category, value => formatArrayField('category', value));
  processField('size', jsonObj.size, value => formatSizeField(value));
  processField('age', jsonObj.age, value => formatAgeField(value));
  processField('time', jsonObj.time, value => formatTimeField(value));
  processField('emailIn', jsonObj.emailIn, value => formatArrayField('in', value));

  return resultArray.join(' AND ');
}

function createLambdaInput(q: string, user:UserInDB, taskName: string): LambdaInput {
  return {
    email: user.email,
    access_token: user.accessToken,
    refresh_token: user.refreshToken as string,
    expires_at: user.expiresAt.toISOString(),
    q,
    task_name: taskName
  };
}

export function convertToUTCDate(
  dateTime: { date: Date; time: string },
  timezone: string
): Date | null {
  // Construct ISO string from date and time, interpret in given timezone
  const iso = `${dateTime.date.toISOString().split('T')[0]}T${dateTime.time}`;
  const parsed = moment.tz(iso, timezone);
  // Validate parsed date
  if (!parsed.isValid()) {
    console.error('Invalid date or timezone');
    return null;
  }
  // Convert to UTC and return Date object
  return parsed.utc().toDate();
}

function formatName(name: string): string {
  // format the name so that it satisfies the regex pattern [0-9a-zA-Z-_.]+
  return name.replace(/[^0-9a-zA-Z-_.]/g, '-');
}

/**
 * Generate a unique name for the schedule
 * The length of the schedule name is guaranteed to be less than 64 characters
 * userId has a length of 36 characters
 * timestamp has a length of 24 characters
 * the total length of the name is 36 + 24 + 1 = 61 characters
 * @param userId 
 * @returns Schedule name
 */
function createScheduleName(userId: string): string {
  const timestamp = convertDateToAWSString(new Date());
  return `${userId}-${timestamp}`;
}

/**
 * Extract the timezone from the schedule expression
 * @param timezone - The timezone string
 * @returns The timezone in the format of 'America/New_York'
 */
function createScheduleTimeZone(timezone: string): string {
  return timezone.split(' ')[1];
}

function createOneTimeScheduleExpression(date: Date, time: string): string {
  const dateString = convertDateToString(date);
  return `at(${dateString}T${time}:00)`;
}

export function createCommandInput(data: FormValues, user: UserInDB) {
  let commandInput;
  let scheduleExpression = '';

  const name = createScheduleName(user.id);
  const description = data.description;
  const scheduleExpressionTimezone = createScheduleTimeZone(data.occurrence.TimeZone);
  const state = 'ENABLED';
  const q: string = formatFields(data);
  const input = JSON.stringify(createLambdaInput(q, user, data.name));
  if ('date' in data.occurrence.Schedule) {
    scheduleExpression = createOneTimeScheduleExpression(
      data.occurrence.Schedule.date,
      data.occurrence.Schedule.time
    );
    commandInput = {
      name,
      scheduleExpression,
      description,
      scheduleExpressionTimezone,
      state,
      input,
    } as CommandInput;
  } else {
    scheduleExpression = `rate(${data.occurrence.Schedule.rate.value} ${data.occurrence.Schedule.rate.unit})`;
    // convert start/end dateTime objects to UTC
    const { startDateAndTime, endDateAndTime } = data.occurrence.Schedule;
    const startDate = convertToUTCDate(startDateAndTime, scheduleExpressionTimezone);
    const endDate = convertToUTCDate(endDateAndTime, scheduleExpressionTimezone);
    commandInput = {
      name,
      scheduleExpression,
      description,
      startDate,
      endDate,
      scheduleExpressionTimezone,
      state,
      input,
    } as CommandInput;
  }
  return commandInput;
}

export function parseJsonToFormValues(json: string): FormValues {
  return JSON.parse(json, (key, value) => {
    if (typeof value === 'string' && isStringDateFormat(value)) {
      return convertDateStringToDate(value);
    }
    return value;
  });
}