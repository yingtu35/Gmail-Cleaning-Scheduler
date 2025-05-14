"use client"

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  FormValues,
  AIFormValues,
} from '@/types/task';
import { AIFormValuesSchema } from '@/validations/form';
import { createTask } from '@/libs/actions';
import { cn } from '@/utils/cn';
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
import { INITIAL_AI_STATE } from '@/app/constants/aiPromptValues';
import { FormControlBarWrapper } from '@/components/task/form/wrapper/form-control-bar-wrapper';

import useMultiStepForm from './hooks/useMultiStepForm';
import ScheduleFormAI from './scheduleForm-ai';
import TaskFormAI from './taskForm-ai';
import ReviewFormAI from './reviewForm-ai';
import StepIndicator, { StepConfig } from './StepIndicator';


interface FormControlGroupProps {
  isFirstStep: boolean;
  isLastStep: boolean;
  isResultGenerated: boolean;
  onEditClicked: () => void;
  onBackClicked: () => void;
  onCancelClicked: () => void;
}
const FormControlGroup = ({
  isFirstStep,
  isLastStep,
  isResultGenerated,
  onEditClicked,
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

  const editButton = (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="secondary"
          type="button"
          disabled={!isResultGenerated}
        >
          Edit
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>This will take you to the template edit form</AlertDialogTitle>
          <AlertDialogDescription>
            You can refine the generated task and schedule to your liking.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onEditClicked}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>    
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
              This will cancel the task creation process and you will lose all your progress.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onCancelClicked}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      { !isResultGenerated && (backButton) }
      {!isLastStep ? (
        <Button
          variant="default"
          type="submit"
        >
          Next
        </Button>
      ) : (
        editButton
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
  onEditAIGeneratedForm: (generatedFormValues: FormValues) => void;
  resetTemplate: () => void;
}

export default function CreateFormAI({ 
  onEditAIGeneratedForm,
  resetTemplate
}: CreateFormAIProps) {
  const router = useRouter();
  const form = useForm<AIFormValues>({
    resolver: zodResolver(AIFormValuesSchema),
    defaultValues: INITIAL_AI_STATE,
    mode: 'onChange'
  });
  
  const { handleSubmit, setValue, control, watch } = form;
  
  const stepDefinitions = [
    { label: 'Task', element: <TaskFormAI key="Task" title="Task Description" control={control} /> },
    { label: 'Schedule', element: <ScheduleFormAI key="Schedule" title="Schedule Description" control={control} watch={watch} /> },
    { label: 'Review', element: <ReviewFormAI key="Review" title="Prompt Review" setValue={setValue} watch={watch} /> },
  ]

  const stepConfigs: StepConfig[] = stepDefinitions.map(d => ({ label: d.label }));
  const { stepRefs, visibleSteps, currentStep, maxStep, isFirstStep, isLastStep, nextStep, prevStep, goToStep } =
    useMultiStepForm(stepDefinitions.map(d => d.element));
    
  const generatedFormValues = watch('formValues.value');
  const isGenerated = watch('formValues.isGenerated');

  const onError = (error: any) => {
    console.error("Form submission error:", error);
  }

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

  const onEditClicked = () => {
    onEditAIGeneratedForm(generatedFormValues);
  }

  const onSubmit = (values: AIFormValues) => {
    if (!isLastStep) return nextStep();
    const formValues = values.formValues.value;
    toast.promise(
      createTask(formValues),
      {
        loading: `Creating task ${formValues.name}...`,
        success: (taskId) => {
          router.push(`/tasks/${taskId}`);
          return `Task ${formValues.name} created successfully!`;
        },
        error: (error) => {
          return error.message || "Error creating task. Please try again later.";
        },
      }
    )
  }

  return (
    <Form {...form}>
      <form id="task-form-ai" onSubmit={handleSubmit(onSubmit, onError)} className="flex flex-col h-screen">
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
            isResultGenerated={isGenerated}
            onEditClicked={onEditClicked}
            onBackClicked={onBackClicked}
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
  )
}