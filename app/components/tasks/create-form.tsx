"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import FormReview from './form-review';
import useMultiStepForm from '@/app/hooks/useMultiStepForm';
import { ScheduleForm } from './scheduleForm';
import { TaskForm } from './taskForm';
import { ReviewForm } from './reviewForm';
import {
  FormValues,
} from '@/app/lib/definitions';


const totalSteps = 3;
const INITIAL_STATE: FormValues = {
  name: '',
  description: '',
  occurrence: {
    Occurrence: 'One-time',
    TimeZone: 'PST',
    Schedule: {
      date: '',
      time: '00:00',
    },
  },
  from: {
    enabled: false,
    from: '',
  },
  to: {
    enabled: false,
    to: '',
  },
  title: {
    enabled: false,
    title: '',
  },
  emailIs: {
    enabled: true,
    emailIs: ["unread"],
  },
  doesntHave: {
    enabled: false,
    doesntHave: '',
  },
  has: {
    enabled: false,
    has: [],
  },
  labels: {
    enabled: false,
    labels: '',
  },
  category: {
    enabled: false,
    category: [],
  },
  size: {
    enabled: false,
    size: {
      comparison: 'greater than',
      value: 1,
      unit: 'MB'
    }
  },
  age: {
    enabled: true,
    age: {
      comparison: 'older than',
      value: 3,
      unit: 'months'
    }
  },
  time: {
    enabled: false,
    time: {
      comparison: 'before',
      // get the date 90 days from now in the format 'YYYY-MM-DD'
      value: new Date(Date.now() - 3 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }
  },
  emailIn: {
    enabled: true,
    emailIn: ["inbox"],
  },
}


const CreateForm = () => {
  const [formValues, setFormValues] = useState<FormValues>(INITIAL_STATE);
  function updateFields(fields: Partial<FormValues>) {
    setFormValues({ ...formValues, ...fields });
  }

  const { steps, step, currentStep, isFirstStep, isLastStep, nextStep, prevStep, goToStep } = useMultiStepForm([
    <ScheduleForm key="Schedule" {...formValues} updateFields={updateFields} />,
    <TaskForm key="Task" {...formValues} updateFields={updateFields} />,
    <ReviewForm key="Review" formValues={formValues} />,
  ]);


  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLastStep) return nextStep();
    // TODO: Create Task
    alert('Task Created');
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
