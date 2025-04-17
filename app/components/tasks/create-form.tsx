"use client"
import React, { useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import useMultiStepForm from '@/app/hooks/useMultiStepForm';
import { isFormValid } from '@/app/utils/form';
import { createTask } from '@/app/lib/actions';
import {
  FormValues,
} from '@/app/lib/definitions';

import StepIndicator, { StepConfig } from './StepIndicator';
import { ScheduleForm } from './scheduleForm';
import { TaskForm } from './taskForm';
import { ReviewForm } from './reviewForm';

interface CreateFormProps {
  formValues: FormValues;
  setFormValues: React.Dispatch<React.SetStateAction<FormValues>>;
  resetTemplate: () => void;
}

const CreateForm = ({
  formValues,
  setFormValues,
  resetTemplate
}: CreateFormProps) => {
  const router = useRouter();

  function updateFields(fields: Partial<FormValues>) {
    setFormValues({ ...formValues, ...fields });
  }

  // define steps with labels and components
  const stepDefinitions = [
    { label: 'Schedule', element: <ScheduleForm key="Schedule" {...formValues} updateFields={updateFields} isEditing={false} /> },
    { label: 'Task', element: <TaskForm key="Task" {...formValues} updateFields={updateFields} /> },
    { label: 'Review', element: <ReviewForm key="Review" formValues={formValues} /> },
  ];
  const stepConfigs: StepConfig[] = stepDefinitions.map(d => ({ label: d.label }));
  const { steps, currentStep, maxStep, isFirstStep, isLastStep, nextStep, prevStep, goToStep } =
    useMultiStepForm(stepDefinitions.map(d => d.element));

  // create refs for each step panel
  const stepRefs = useRef(steps.map(() => React.createRef<HTMLDivElement>()));

  const visibleSteps = steps.slice(0, maxStep + 1);

  // scroll to active panel on step change
  useEffect(() => {
    // scroll only when currentStep or maxStep changes, so panel is rendered
    const panel = stepRefs.current[currentStep]?.current;
    if (panel) {
      panel.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentStep, maxStep]);

  const onBackClicked = () => {
    if (isFirstStep) {
      confirm('This will reset the form. Are you sure?') && resetTemplate();
    } else {
      prevStep();
    }
  }

  const onCancelClicked = () => {
    confirm('Are you sure you want to cancel?') && router.push('/');
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid(currentStep, formValues)) {
      return;
    }
    if (!isLastStep) return nextStep();
    createTask(formValues);
    // TODO: Add notification
  };
  return (
    <form id="task-form" onSubmit={onSubmit} className="flex flex-col h-screen">
      <div className="sticky top-0 bg-white flex items-center justify-between p-4 z-10 shadow">
        <div className="flex-1">
          <StepIndicator
            steps={stepConfigs}
            currentStep={currentStep}
            maxStep={maxStep}
            goToStep={goToStep}
          />
        </div>
        <div className="flex items-center gap-4">
          <Link href="https://support.google.com/mail/answer/7190?hl=en" target="_blank" className="text-blue-600 hover:underline">Help</Link>
          <Button
            variant="destructive"
            type="button"
            onClick={onCancelClicked}
          >
            Cancel
          </Button>
          <Button
            variant="secondary"
            type="button"
            onClick={onBackClicked}
          >
            Back
          </Button>
          <Button
            variant="default"
            type="submit"
            disabled={isLastStep}
          >
            Next
          </Button>
          <Button
            variant="default"
            type="submit"
            disabled={!isLastStep}
          >
            Create
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden min-h-0">
        {visibleSteps.map((stepElement, idx) => (
          <div
            key={idx}
            ref={stepRefs.current[idx]}
            className="h-full snap-start relative flex flex-col overflow-y-auto m-4 p-4 space-y-4"
          >
            {/* Step content */}
            {stepElement}
          </div>
        ))}
      </div>
    </form>
  );
};

export default CreateForm;
