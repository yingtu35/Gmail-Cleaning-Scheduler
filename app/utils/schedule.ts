import { UserInDB, FormValues, CommandInput, LambdaInput, TimeValue, AgeValue, SizeValue } from "@/app/lib/definitions"
import moment from "moment-timezone";

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

  processField('from', jsonObj.from, value => formatStringField('from', value));
  processField('to', jsonObj.to, value => formatStringField('to', value));
  processField('title', jsonObj.title, value => formatStringField('title', value));
  processField('emailIs', jsonObj.emailIs, value => formatArrayField('is', value));
  processField('doesntHave', jsonObj.doesntHave, value => formatStringField('doesntHave', value));
  processField('has', jsonObj.has, value => formatArrayField('has', value));
  processField('labels', jsonObj.labels, value => formatStringField('label', value));
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

export function convertToUTCDate(dateString: string, timezone: string): Date | null {
  // Parse the date string using moment-timezone with the specified timezone
  const parsedDate = moment.tz(dateString, timezone);
  
  // Validate if the parsedDate is valid
  if (!parsedDate.isValid()) {
      console.error('Invalid date or timezone');
      return null;
  }
  
  // Get the UTC date object
  const utcDate = parsedDate.toDate();
  
  return utcDate;
}

export function createCommandInput(data: FormValues, user: UserInDB) {
  let commandInput;
  const name = data.name;
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
    const startDate = convertToUTCDate(data.occurrence.Schedule.startDate, scheduleExpressionTimezone);
    const endDate = convertToUTCDate(data.occurrence.Schedule.endDate, scheduleExpressionTimezone);
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