import { UserDateTimePromptType } from "@/types/user";
import timezones from "timezones-list";

const timezonesMap = timezones.reduce((acc, tz) => {
  acc[tz.tzCode] = {
    label: tz.tzCode,
    value: `(UTC${tz.utc}) ${tz.tzCode}`
  };
  return acc;
}, {} as Record<string, { label: string; value: string }>);

export const epochToDate = (epoch: number | undefined) => {
  if (!epoch) {
    return new Date();
  }
  return new Date(epoch * 1000);
}

export const getUserDateTimePrompt = (): UserDateTimePromptType => {
  const date = new Date();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const formattedDate = `${yyyy}-${mm}-${dd}`;

  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  const formattedTime = `${hh}:${min}`;

  const tzValue = timezonesMap[timezone]?.value || timezone;

  return {
    date: formattedDate,
    time: formattedTime,
    timezone: tzValue
  }
}

/** 
 * Function to convert a date string format to a Date object
 * The date string accepts two formats: 
 * 1. YYYY-MM-DD
 * 2. YYYY-MM-DDTHH:mm:ss.SSSZ
 *  */
export const isStringDateFormat = (dateString: string): boolean => {
  const datePattern = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}\.\d{3}Z)?$/; // YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.SSSZ format
  return datePattern.test(dateString)
}

/**
 * Function to convert a date string format to a Date object
 * @param dateString - The date string in YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.SSSZ format
 * @returns - A Date object, ignoring the time part if present
 */
export const convertDateStringToDate = (dateString: string): Date => {
  if (dateString.includes('T')) {
    // If the date string contains 'T', split it and only keep the date part
    dateString = dateString.split('T')[0];
  }
  const dateParts = dateString.split('-');
  const year = parseInt(dateParts[0], 10);
  const month = parseInt(dateParts[1], 10) - 1; // Months are zero-based in JavaScript
  const day = parseInt(dateParts[2], 10);

  return new Date(year, month, day);
}

/**
 * Function to convert a Date object to a string
 * @param date - The Date object to be converted
 * @returns - A string in either YYYY-MM-DD format
 */
export const convertDateToString = (date: Date): string => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Function to convert a Date object to a string that is compatible with AWS schedule naming
 * @param date - The Date object to be converted
 * @returns - A string in either YYYY-MM-DD or YYYY-MM-DD:HH:mm:ss.SSSZ format
 */
export const convertDateToAWSString = (date: Date): string => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  const ms = String(date.getMilliseconds()).padStart(3, '0');
  return `${yyyy}-${mm}-${dd}T${hh}-${min}-${ss}.${ms}Z`;
}