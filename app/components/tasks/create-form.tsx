"use client"

import React from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';
import useMultiStepForm from '@/app/hooks/useMultiStepForm';
import { createTask } from '@/app/lib/actions';
import { formValuesSchema }  from '@/app/lib/validation/form'
import type { FormValues }    from '@/app/lib/definitions'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Form,
} from "@/components/ui/form"
import { Button } from '@/components/ui/button';


import StepIndicator, { StepConfig } from './StepIndicator';
import { ScheduleForm } from './scheduleForm';
import { TaskForm } from './taskForm';
import { ReviewForm } from './reviewForm';

interface FormControlGroupProps {
  isFirstStep: boolean;
  isLastStep: boolean;
  onBackClicked: () => void;
  onCancelClicked: () => void;
}

const FormControlGroup = ({
  isFirstStep,
  isLastStep,
  onBackClicked,
  onCancelClicked,
  className,
}: FormControlGroupProps & {
  className?: string;
}) => {
  const backButton = isFirstStep ? (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="secondary"
          type="button"
        >
          Back
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to go back?</AlertDialogTitle>
          <AlertDialogDescription>
            This will take you back to template selection and you will lose all your progress.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onBackClicked}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ) : (
    <Button
      variant="secondary"
      type="button"
      onClick={onBackClicked}
    >
      Back
    </Button>
  )

  return (
    <div className={cn("flex items-center space-x-4", className)}>
      <Link href="https://support.google.com/mail/answer/7190?hl=en" target="_blank" className="text-blue-600 hover:underline">Help</Link>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            type="button"
          >
            Cancel
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to cancel?</AlertDialogTitle>
            <AlertDialogDescription>
              This will cancel the task creation process and you will lose all your progress.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onCancelClicked}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {backButton}
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
  )
}

interface CreateFormProps {
  formValues: FormValues;
  resetTemplate: () => void;
}

const CreateForm = ({
  formValues,
  resetTemplate
}: CreateFormProps) => {
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formValuesSchema),
    defaultValues: formValues,
    mode: 'onChange'
  });
  const { handleSubmit, control, watch } = form;
  
  // define steps with labels and components
  const stepDefinitions = [
    { label: 'Schedule', element: <ScheduleForm key="Schedule" title="Step 1: Schedule Details" control={control} watch={watch} /> },
    { label: 'Task', element: <TaskForm key="Task" title="Step 2: Task Details" control={control} watch={watch} /> },
    { label: 'Review', element: <ReviewForm key="Review" formValues={formValues} /> },
  ];
  const stepConfigs: StepConfig[] = stepDefinitions.map(d => ({ label: d.label }));
  const { stepRefs, visibleSteps, currentStep, maxStep, isFirstStep, isLastStep, nextStep, prevStep, goToStep } =
  useMultiStepForm(stepDefinitions.map(d => d.element));

  const onBackClicked = () => {
    if (isFirstStep) {
      resetTemplate();
    } else {
      prevStep();
    }
  }

  const onCancelClicked = () => {
    router.push('/');
  }

  const onSubmit = (values: FormValues) => {
    if (!isLastStep) return nextStep();
    createTask(values);
  }
  return (
    <Form {...form}>
      <form id="task-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-screen">
        {/* Form header */}
        <div className="sticky top-0 bg-white flex items-center justify-between p-4 z-10 shadow">
          <div className="flex-1">
            <StepIndicator
              steps={stepConfigs}
              currentStep={currentStep}
              maxStep={maxStep}
              goToStep={goToStep}
            />
          </div>
          <FormControlGroup
            isFirstStep={isFirstStep}
            isLastStep={isLastStep}
            onBackClicked={onBackClicked}
            onCancelClicked={onCancelClicked}
          />
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
    </Form>
  );
};

export default CreateForm;
