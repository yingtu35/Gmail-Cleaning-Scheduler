"use client"

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';
import {
  FormValues,
} from '@/app/lib/definitions';
import { updateTask } from '@/app/lib/actions';
import { zodResolver } from '@hookform/resolvers/zod';
import { formValuesSchema }  from '@/app/lib/validation/form'
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
import { FormControlBarWrapper } from '@/components/task/form/wrapper/form-control-bar-wrapper';
import { FIELDS_TO_VALIDATE } from '@/app/constants/formValues';

import { ScheduleForm } from './scheduleForm';
import { TaskForm } from './taskForm';
import { ReviewForm } from './reviewForm';
import StepIndicator, { StepConfig } from './StepIndicator';
import useMultiStepForm from './hooks/useMultiStepForm';

interface FormControlGroupProps {
  isFirstStep: boolean;
  isLastStep: boolean;
  onBackClicked: () => void;
  onNextClicked: () => void;
  onCancelClicked: () => void;
}

const FormControlGroup = ({
  isFirstStep,
  isLastStep,
  onBackClicked,
  onNextClicked,
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
            This will take you back to task page and you will lose all your progress.
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
    <div className={cn("flex flex-wrap items-center space-x-4", className)}>
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
              This will cancel the editing process and you will lose all your progress.
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
        type="button"
        disabled={isLastStep}
        className={cn(isLastStep ? "cursor-not-allowed" : "cursor-pointer")}
        onClick={onNextClicked}
      >
        Next
      </Button>
      <Button
        variant="default"
        type="submit"
        disabled={!isLastStep}
        className={cn(isLastStep ? "cursor-pointer" : "cursor-not-allowed")}
      >
        Update
      </Button>
    </div>
  )
}

const EditForm = ({ task, taskId }: { task: FormValues, taskId: string }) => {
  const router = useRouter();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formValuesSchema),
    defaultValues: task,
    mode: 'onChange'
  });
  const { handleSubmit, control, watch, formState: { errors }, trigger } = form;

  const stepDefinitions = [
      { label: 'Schedule', element: <ScheduleForm key="Schedule" title="Step 1: Schedule Details" control={control} watch={watch} /> },
      { label: 'Task', element: <TaskForm key="Task" title="Step 2: Task Details" control={control} watch={watch} errors={errors} /> },
      { label: 'Review', element: <ReviewForm key="Review" watch={watch} /> },
    ];

  const stepConfigs: StepConfig[] = stepDefinitions.map(d => ({ label: d.label }));
    const { stepRefs, visibleSteps, currentStep, maxStep, isFirstStep, isLastStep, nextStep, prevStep, goToStep } =
    useMultiStepForm(stepDefinitions.map(d => d.element));

  const onBackClicked = () => {
    if (isFirstStep) {
      router.back();
    } else {
      prevStep();
    }
  }

  const onCancelClicked = () => {
    router.back();
  }

  const onNextClicked = async () => {
    if (isLastStep || currentStep > FIELDS_TO_VALIDATE.length - 1) return;
    const fieldsToValidate = FIELDS_TO_VALIDATE[currentStep];
    let isValid = true;
    if (fieldsToValidate.length > 0) {
      // Trigger validation for the current step's fields
      isValid = await trigger(fieldsToValidate, { shouldFocus: true });
    } else {
      isValid = await trigger();
    }

    if (!isValid) {
      return;
    }
    nextStep();
  }

  const onSubmit = (values: FormValues) => {
    if (!isLastStep) {
      console.warn("onSubmit called before last step, this should be handled by onNextClicked");
      return;
    }

    toast.promise(
      updateTask(values, taskId),
      {
        loading: `Updating task ${values.name}...`,
        success: (taskId) => {
          router.push(`/tasks/${taskId}`);
          return `Task ${values.name} updated successfully!`;
        },
        error: (error) => {
          return error.message || "Error updating task. Please try again later.";
        },
      }
    )
  }

  const onError = (error: any) => {
    console.error("Form submission error:", error);
  }

  return (
    <Form {...form}>
      <form id="edit-task-form" onSubmit={handleSubmit(onSubmit, onError)} className="flex flex-col h-screen">
        {/* Form header */}
        <FormControlBarWrapper>
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
            onNextClicked={onNextClicked}
            onCancelClicked={onCancelClicked}
          />
        </FormControlBarWrapper>
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

export default EditForm;
