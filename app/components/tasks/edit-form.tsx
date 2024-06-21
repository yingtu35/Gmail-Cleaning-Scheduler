"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import useMultiStepForm from '@/app/hooks/useMultiStepForm';
import { ScheduleForm } from './scheduleForm';
import { TaskForm } from './taskForm';
import { ReviewForm } from './reviewForm';
import {
  FormValues,
} from '@/app/lib/definitions';
import { isEndDateLarger } from '@/app/utils/date';
import { updateTask } from '@/app/lib/actions';

const EditForm = ({ task, taskId } : { task: FormValues, taskId: string}) => {
  const [formValues, setFormValues] = useState<FormValues>(task);
  console.log("taskId", taskId);
  function updateFields(fields: Partial<FormValues>) {
    setFormValues({ ...formValues, ...fields });
  }

  const { steps, step, currentStep, isFirstStep, isLastStep, nextStep, prevStep, goToStep } = useMultiStepForm([
    <ScheduleForm key="Schedule" {...formValues} updateFields={updateFields} isEditing={true} />,
    <TaskForm key="Task" {...formValues} updateFields={updateFields} />,
    <ReviewForm key="Review" formValues={formValues} />,
  ]);

  function validateForm() {
    if (currentStep === 0) {
      if ('startDate' in formValues.occurrence.Schedule && !isEndDateLarger(formValues.occurrence.Schedule.startDate, formValues.occurrence.Schedule.endDate)) {
        return false;
      }
    }
    return true;
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLastStep) return nextStep();
    // TODO: Edit Task
    alert('Task Edited');
    updateTask(formValues, taskId);
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
          <Link href={`/tasks/${taskId}`}>
            <button type="button" className="px-4 py-2 hover:bg-gray-200 transition text-gray-700 rounded-md">Cancel</button>
          </Link>
          {!isLastStep && <button type="button" onClick={() => goToStep(steps.length-1)} className="px-4 py-2 bg-blue-600 text-white rounded-md">Skip to Review</button>}
          {!isFirstStep && <button type="button" onClick={prevStep} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md">Back</button>}
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">
            {isLastStep ? "Update" : "Next"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default EditForm;
