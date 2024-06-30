"use client"

import Link from 'next/link';
import useMultiStepForm from '@/app/hooks/useMultiStepForm';
import ScheduleFormAI from './scheduleForm-ai';
import TaskFormAI from './taskForm-ai';
import ReviewFormAI from './reviewForm-ai';
import {
  FormValues,
  AIPromptValues,
} from '@/app/lib/definitions';
import { useState } from 'react';

export default function CreateFormAI({ 
  onSwitchForm,
  formValues,
  setFormValues,
  aiPromptValues,
  setAIPromptValues,
}: { 
  onSwitchForm: () => void,
  formValues: FormValues,
  setFormValues: React.Dispatch<React.SetStateAction<FormValues>>;
  aiPromptValues: AIPromptValues,
  setAIPromptValues: React.Dispatch<React.SetStateAction<AIPromptValues>>;
  }){
  
  const [isResultGenerated, setIsResultGenerated] = useState<boolean>(false);

  function updatePromptFields(fields: Partial<AIPromptValues>) {
    setAIPromptValues({ ...aiPromptValues, ...fields });
  }

  function updateFields(fields: Partial<FormValues>) {
    setFormValues({ ...formValues, ...fields });
  }
  const { step, currentStep, isFirstStep, isLastStep, nextStep, prevStep, goToStep } = useMultiStepForm([
    <TaskFormAI key="Task" {...aiPromptValues} updatePromptFields={updatePromptFields} />,
    <ScheduleFormAI key="Schedule" {...aiPromptValues} updatePromptFields={updatePromptFields} />,
    <ReviewFormAI key="Review" formValues={formValues} aiPromptValues={aiPromptValues} updateFields={updateFields} isResultGenerated={isResultGenerated} setIsResultGenerated={setIsResultGenerated} />,
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
            {!isResultGenerated && <button type="button" onClick={onSwitchForm} className="px-4 py-2 bg-green-400 hover:bg-green-200 transition text-gray-700 rounded-md">Switch to Own Form</button>}
            <Link href="https://support.google.com/mail/answer/7190?hl=en" target='_blank' className="text-blue-600">Help</Link>
            <Link href="/">
              <button type="button" className="px-4 py-2 hover:bg-gray-200 transition text-gray-700 rounded-md">Cancel</button>
            </Link>
            {!isFirstStep && (
              isResultGenerated ? (
                <button type="button" onClick={onSwitchForm} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md">Edit</button>
              ) : (
                <button type="button" onClick={prevStep} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md">Back</button>)
              )
            }
            {isResultGenerated ? (
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">
                Create
              </button>
            ) : !isLastStep && (
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">
                Next
              </button>
              )}
          </div>
        </div>
      </form>
  )
}