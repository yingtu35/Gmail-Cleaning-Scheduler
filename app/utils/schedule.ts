import { UserInDB, FormValues, CommandInput, LambdaInput, TimeValue, AgeValue, SizeValue } from "@/app/lib/definitions"
import moment from "moment-timezone";
import { convertDateStringToDate, isStringDateFormat } from "./date";

function formatArrayField(key: string, fieldValue: any[]): string {
  return fieldValue.map(value => `${key}:${value.trim()}`).join(' OR ');
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
  return `${fieldValue.comparison}:${fieldValue.value}`;
}

type Field<T> = { enabled: boolean; } & { [key: string]: T | boolean; };

export function formatFields(jsonObj: FormValues): string {
  const resultArray: string[] = [];

  function processField<T>(key: string, field: Field<T>, formatter: (fieldValue: T) => string) {
      if (field.enabled) {
          const fieldValue = field[key];
          if (typeof fieldValue !== 'boolean') {
            const formattedString = formatter(fieldValue);
            resultArray.push(`(${formattedString})`);
          }
      }
  }

  processField('from', jsonObj.from, value => formatArrayField('from', value));
  processField('to', jsonObj.to, value => formatArrayField('to', value));
  // TODO: title should be "subject"
  processField('title', jsonObj.title, value => formatArrayField('title', value));
  processField('emailIs', jsonObj.emailIs, value => formatArrayField('is', value));
  // TODO: doesntHave should be "-"
  processField('doesntHave', jsonObj.doesntHave, value => formatArrayField('doesntHave', value));
  processField('has', jsonObj.has, value => formatArrayField('has', value));
  processField('labels', jsonObj.labels, value => formatArrayField('label', value));
  processField('category', jsonObj.category, value => formatArrayField('category', value));
  processField('size', jsonObj.size, value => formatSizeField(value));
  processField('age', jsonObj.age, value => formatAgeField(value));
  processField('time', jsonObj.time, value => formatTimeField(value));
  processField('emailIn', jsonObj.emailIn, value => formatArrayField('in', value));

  return resultArray.join(' AND ');
}

function createLambdaInput(q: string, user:UserInDB): LambdaInput {
  return {
    email: user.email,
    access_token: user.accessToken,
    refresh_token: user.refreshToken as string,
    expires_at: user.expiresAt.toISOString(),
    q
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

export function createCommandInput(data: FormValues, user: UserInDB) {
  let commandInput;
  const name = formatName(user.name) + '-' + formatName(data.name);
  let scheduleExpression = '';
  const description = data.description;
  const scheduleExpressionTimezone = data.occurrence.TimeZone;
  const state = 'ENABLED';
  const q: string = formatFields(data);
  const input = JSON.stringify(createLambdaInput(q, user));
  if ('date' in data.occurrence.Schedule) {
    scheduleExpression = `at(${data.occurrence.Schedule.date}T${data.occurrence.Schedule.time}:00)`;
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