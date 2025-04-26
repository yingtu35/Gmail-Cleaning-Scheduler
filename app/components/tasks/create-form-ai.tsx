"use client"

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import useMultiStepForm from '@/app/hooks/useMultiStepForm';
import {
  FormValues,
  AIPromptValues,
} from '@/app/lib/definitions';
import { cn } from '@/lib/utils';
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
import { Button } from '@/components/ui/button';

import ScheduleFormAI from './scheduleForm-ai';
import TaskFormAI from './taskForm-ai';
import ReviewFormAI from './reviewForm-ai';
import StepIndicator, { StepConfig } from './StepIndicator';

interface FormControlGroupProps {
  isFirstStep: boolean;
  isLastStep: boolean;
  isResultGenerated: boolean;
  onEditAIGeneratedForm: () => void;
  onBackClicked: () => void;
  onCancelClicked: () => void;
}
const FormControlGroup = ({
  isFirstStep,
  isLastStep,
  isResultGenerated,
  onEditAIGeneratedForm,
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
      {!isLastStep ? (
        <Button
          variant="default"
          type="submit"
        >
          Next
        </Button>
      ) : (
        <Button
          variant="default"
          type="button"
          onClick={onEditAIGeneratedForm}
          disabled={!isResultGenerated}
        >
          Edit
        </Button>
      )}
      <Button
        variant="default"
        type="submit"
        disabled={!isResultGenerated}
      >
        Create
      </Button>
    </div>
  )
}

interface CreateFormAIProps {
  onEditAIGeneratedForm: () => void;
  formValues: FormValues;
  setFormValues: React.Dispatch<React.SetStateAction<FormValues>>;
  aiPromptValues: AIPromptValues;
  setAIPromptValues: React.Dispatch<React.SetStateAction<AIPromptValues>>;
  resetTemplate: () => void;
}

export default function CreateFormAI({ 
  onEditAIGeneratedForm,
  formValues,
  setFormValues,
  aiPromptValues,
  setAIPromptValues,
  resetTemplate
}: CreateFormAIProps) {
  const router = useRouter();
  const [isResultGenerated, setIsResultGenerated] = useState<boolean>(false);

  function updatePromptFields(fields: Partial<AIPromptValues>) {
    setAIPromptValues({ ...aiPromptValues, ...fields });
  }

  function updateFields(fields: Partial<FormValues>) {
    setFormValues({ ...formValues, ...fields });
  }

  const stepDefinitions = [
    { label: 'Task', element: <TaskFormAI key="Task" {...aiPromptValues} updatePromptFields={updatePromptFields} /> },
    { label: 'Schedule', element: <ScheduleFormAI key="Schedule" {...aiPromptValues} updatePromptFields={updatePromptFields} /> },
    { label: 'Review', element: <ReviewFormAI key="Review" formValues={formValues} aiPromptValues={aiPromptValues} updateFields={updateFields} isResultGenerated={isResultGenerated} setIsResultGenerated={setIsResultGenerated} /> },
  ]

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

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLastStep) return nextStep();
    // TODO: Create Task
    alert('Task Created');
  };
  return (
      <form id="task-form-ai" onSubmit={onSubmit} className="flex flex-col h-screen">
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
            isResultGenerated={isResultGenerated}
            onEditAIGeneratedForm={onEditAIGeneratedForm}
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
  )
}