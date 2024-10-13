import {
  FormValues,
  OneTimeSchedule,
  RecurringSchedule,
} from '@/app/lib/definitions';

export const isScheduleOneTime = (schedule: OneTimeSchedule | RecurringSchedule): schedule is OneTimeSchedule => {
  return 'date' in schedule;
}

export function isScheduleRecurring(schedule: OneTimeSchedule | RecurringSchedule): schedule is RecurringSchedule {
  return 'startDate' in schedule;
}

export const isEndDateLarger = (startDate: string, endDate: string): Boolean => {
  if (!endDate || !startDate) {
    return true;
  }
  return new Date(startDate) < new Date(endDate);
}

export function isFormValid(currentStep: number, formValues: FormValues): Boolean {
  if (currentStep === 0) {
    if (isScheduleRecurring(formValues.occurrence.Schedule) && !isEndDateLarger(formValues.occurrence.Schedule.startDate, formValues.occurrence.Schedule.endDate)) {
      return false;
    }
  }
  return true;
}