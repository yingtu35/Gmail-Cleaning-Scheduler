"use client"
import React from 'react';
import Link from 'next/link';
import useMultiStepForm from '@/app/hooks/useMultiStepForm';
import { ScheduleForm } from './scheduleForm';
import { TaskForm } from './taskForm';
import { ReviewForm } from './reviewForm';
import { isEndDateLarger } from '@/app/utils/date';
import { createTask } from '@/app/lib/actions';

import {
  FormValues,
  OneTimeSchedule,
  RecurringSchedule,
} from '@/app/lib/definitions';


const CreateForm = ({
  formValues,
  setFormValues,
}: {
  formValues: FormValues;
  setFormValues: React.Dispatch<React.SetStateAction<FormValues>>;
}) => {
  function updateFields(fields: Partial<FormValues>) {
    setFormValues({ ...formValues, ...fields });
  }

  const { steps, step, currentStep, isFirstStep, isLastStep, nextStep, prevStep } = useMultiStepForm([
    <ScheduleForm key="Schedule" {...formValues} updateFields={updateFields} isEditing={false} />,
    <TaskForm key="Task" {...formValues} updateFields={updateFields} />,
    <ReviewForm key="Review" formValues={formValues} />,
  ]);

  function isScheduleRecurring(schedule: OneTimeSchedule | RecurringSchedule): schedule is RecurringSchedule {
    return 'startDate' in schedule;
  }

  function isFormValid() {
    if (currentStep === 0) {
      if (isScheduleRecurring(formValues.occurrence.Schedule) && !isEndDateLarger(formValues.occurrence.Schedule.startDate, formValues.occurrence.Schedule.endDate)) {
        return false;
      }
    }
    return true;
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid()) {
      return;
    }
    if (!isLastStep) return nextStep();
    createTask(formValues);
    // TODO: Add notification
  };
  return (
    <form id="task-form" onSubmit={onSubmit}>
      <div className="relative space-y-4 p-4">
        <div className='absolute top-0 right-4'>
          Step {currentStep + 1} of {steps.length}
        </div>
        {step}
        <div className="flex items-center justify-end mt-4 gap-4">
          <Link href="https://support.google.com/mail/answer/7190?hl=en" target='_blank' className="text-blue-600">Help</Link>
          <Link href="/">
            <button type="button" className="px-4 py-2 hover:bg-gray-200 transition text-gray-700 rounded-md">Cancel</button>
          </Link>
          {!isFirstStep && <button type="button" onClick={prevStep} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md">Back</button>}
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">
            {isLastStep ? "Create" : "Next"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CreateForm;
