"use client"

import Link from 'next/link';
import useMultiStepForm from '@/app/hooks/useMultiStepForm';
import ScheduleFormAI from './scheduleForm-ai';
import TaskFormAI from './taskForm-ai';
import { ReviewForm } from './reviewForm';
import {
  FormValues,
} from '@/app/lib/definitions';
import { INITIAL_STATE } from '@/app/data/form';
import { useState } from 'react';

export default function CreateFormAI({ onReselect }: { onReselect: () => void }){
  const [formValues, setFormValues] = useState<FormValues>(INITIAL_STATE);
  function updateFields(fields: Partial<FormValues>) {
    setFormValues({ ...formValues, ...fields });
  }
  const { step, currentStep, isFirstStep, isLastStep, nextStep, prevStep, goToStep } = useMultiStepForm([
    <TaskFormAI key="Task" />,
    <ScheduleFormAI key="Schedule" />,
    <ReviewForm key="Review" formValues={formValues} />,
  ]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLastStep) return nextStep();
    // TODO: Create Task
    alert('Task Created');
  };
  return (
      <form id="task-form-ai" onSubmit={onSubmit}>
        <div className="relative space-y-4 p-4">
          {step}
          <div className="flex items-center justify-end mt-4 gap-4">
            <button type="button" onClick={onReselect} className="px-4 py-2 bg-green-400 hover:bg-green-200 transition text-gray-700 rounded-md">Reselect</button>
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
  )
}