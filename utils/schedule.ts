import moment from "moment-timezone";

import { User } from "@/types/user"
import { 
  FormValues,
  TimeValue,
  AgeValue,
  SizeValue
 } from "@/types/task"
import {
  CommandInput,
  LambdaInput
} from "@/types/aws"

import { 
  convertDateStringToDate, 
  isStringDateFormat, 
  convertDateToString, 
  convertDateToAWSString
} from "./date";

/**
 * Format a string field for the query
 * Trim the field value to remove leading and trailing whitespace
 * If the field value contains whitespace, replace it with a hyphen (-)
 * If the field value contains a colon (:), replace it with a hyphen (-)
 * @param value - The field value to format
 * @returns The formatted field value
 * @example
 * formatStringField('Hello World: Test') // returns 'Hello-World--Test'
 * formatStringField('  Hello World  ') // returns 'Hello-World'
 */
function formatStringField(value: string): string {
  const separatorRegex = /[\s:]+/g;
  return value.trim().replace(separatorRegex, '-');
}

/**
 * Format an array field for the query
 * Map each value in the array to a string field using formatStringField
 * Join the formatted values with a space
 * Wrap the result in curly braces
 * @param key - The field key
 * @param fieldValue - The array field value to format
 * @returns The formatted field value
 * @example
 * formatArrayField('from', ['Hello World', 'Test']) // returns '{from:Hello-World from:Test}'
 */
function formatArrayField(key: string, fieldValue: any[]): string {
  const query = fieldValue.map(value => `${key}:${formatStringField(value)}`).join(' ');
  return `{${query}}`;
}

/**
 * Format an excluded field for the query
 * Map each value in the array to a string field using formatStringField
 * Join the formatted values with a space
 * Wrap the result in parentheses
 * @param key - The field key
 * @param fieldValue - The array field value to format
 * @returns The formatted field value
 * @example
 * formatExcludedField('-', ['Hello World', 'Test']) // returns '(-Hello-World -Test)'
 */
function formatExcludedField(key: string, fieldValue: any[]): string {
  const query = fieldValue.map(value => `${key}${formatStringField(value)}`).join(' ');
  return `(${query})`;
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

function createLambdaInput(q: string, user:User, taskName: string, taskId: string): LambdaInput {
  return {
    user_id: user.id,
    email: user.email,
    access_token: user.accessToken,
    refresh_token: user.refreshToken as string,
    q,
    task_name: taskName,
    task_id: taskId
  };
}

/**
 * Get the timezone string in the format 'Area/Location' (e.g., 'America/Los_Angeles')
 * Handles input formats:
 *   1. 'Area/Location'
 *   2. '(UTC-08:00) Area/Location'
 * Always returns 'Area/Location' style.
 * @param timezone - The timezone string
 * @returns The timezone in the format of 'Area/Location'
 */
function getTzTimeZone(timezone: string): string {
  const match = timezone.match(/^\(UTC[+-]\d{2}:\d{2}\)\s*(.*)$/);
  if (match && match[1]) {
    return match[1]; // Return the 'Area/Location' part
  }
  // If not, return the original timezone
  return timezone;
}

export function convertToUTCDate(
  dateTime: { date: Date; time: string },
  timezone: string
): Date | null {
  // Construct ISO string from date and time, interpret in given timezone
  const iso = `${dateTime.date.toISOString().split('T')[0]}T${dateTime.time}`;
  const parsed = moment.tz(iso, getTzTimeZone(timezone));
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
export function createScheduleName(userId: string): string {
  const timestamp = convertDateToAWSString(new Date());
  return `${userId}-${timestamp}`;
}

function createOneTimeScheduleExpression(date: Date, time: string): string {
  const dateString = convertDateToString(date);
  return `at(${dateString}T${time}:00)`;
}

export function generateCreateScheduleCommand(data: FormValues, user: User, taskId: string, scheduleName: string) {
  let commandInput;
  let scheduleExpression = '';

  const name = scheduleName;
  const description = data.description;
  const scheduleExpressionTimezone = getTzTimeZone(data.occurrence.TimeZone);
  const state = 'ENABLED';
  const q: string = formatFields(data);
  const input = JSON.stringify(createLambdaInput(q, user, data.name, taskId));
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

export function generateUpdateScheduleCommand(data: FormValues, user: User, taskId: string, scheduleName: string) {
  let commandInput;

  const name = scheduleName;
  const description = data.description;
  const scheduleExpressionTimezone = getTzTimeZone(data.occurrence.TimeZone);
  const state = 'ENABLED';
  const q: string = formatFields(data);
  const input = JSON.stringify(createLambdaInput(q, user, data.name, taskId));
  if ('date' in data.occurrence.Schedule) {
    const scheduleExpression = createOneTimeScheduleExpression(
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
    const scheduleExpression = `rate(${data.occurrence.Schedule.rate.value} ${data.occurrence.Schedule.rate.unit})`;
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