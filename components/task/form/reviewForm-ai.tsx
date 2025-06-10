import { useState } from 'react';
import { UseFormSetValue, UseFormWatch } from 'react-hook-form';

import {
  AIFormValues,
} from '@/types/task';
import { Button } from '@/components/ui/button';
import { generateScheduleByPrompt } from '@/actions/ai';

import { ScheduleDetail } from '@/components/task/detail/schedule-detail';
import { TaskDetail } from '@/components/task/detail/task-detail';
import { getUserDateTimePrompt } from '@/utils/date';

import { FormWrapper } from './wrapper/formWrapper';
import { SectionWrapper } from './wrapper/sectionWrapper';

type ReviewFormAIProps = {
  title: string;
  setValue: UseFormSetValue<AIFormValues>;
  watch: UseFormWatch<AIFormValues>;
}

export default function ReviewFormAI({
  title,
  setValue,
  watch
}: ReviewFormAIProps) {
  const aiFormValues = watch();

  const { prompt, formValues } = aiFormValues;
  const { isGenerated, value: formValuesValue } = formValues;
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // convert formValues to an array of key-value pairs
  const aggregatedEntries = Object.entries(formValuesValue)
  // extract the first 3 entries
  const scheduleEntries = aggregatedEntries.slice(0, 3)
  const taskEntries = aggregatedEntries.slice(3)

  async function onGenerate() {
    setLoading(true);
    setError(null);
    const userDateTimePrompt = getUserDateTimePrompt();
    const result = await generateScheduleByPrompt(userDateTimePrompt, prompt);
    if (typeof result === "string") {
      setError(result);
    } else {
      setValue("formValues", {
        isGenerated: true,
        value: result,
      });
    }
    setLoading(false);
  }
  
  return (
    <FormWrapper title={title}>
      <SectionWrapper title="Prompt Detail">
        <PromptDetail 
          prompt={prompt}
        />
        { !isGenerated && (
          <GenerateScheduleForm 
            onGenerate={onGenerate} 
            isLoading={isLoading} 
            error={error}
          />
        )}
      </SectionWrapper>
        { isGenerated && (
          <>
            <SectionWrapper title="Schedule Detail">
              <ScheduleDetail scheduleEntries={scheduleEntries} />
            </SectionWrapper>
            <SectionWrapper title="Task Detail">
              <TaskDetail taskEntries={taskEntries} />
            </SectionWrapper>
          </>
        )}
    </FormWrapper>
  )
}

function GenerateScheduleForm({
  onGenerate,
  isLoading,
  error
}: {
  onGenerate: () => void;
  isLoading: boolean;
  error: string | null;
}) {
  return (
    <>
      <div>
        <p className="font-semibold">Ready to generate schedule?</p>
        <p className="text-sm text-muted-foreground mt-2">
          Once you click generate, you cannot go back to the previous step.
          <br />
          You can edit the generated schedule later by clicking the edit button on the top right.
        </p>
        <Button
          variant="default"
          className="mt-2 w-full"
          onClick={onGenerate}
          disabled={isLoading}
        >
          {isLoading ? "Generating..." : "Generate"}
        </Button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
    </>
  )
}

interface PromptDetailProps {
  prompt: {
    taskPrompt: string;
    schedulePrompt: {
      Occurrence: string;
      Prompt: string;
    }
  }
}

function PromptDetail({
  prompt
}: PromptDetailProps) {
  const { taskPrompt, schedulePrompt } = prompt;
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Task Prompt</h3>
        <p className="text-[0.8rem] text-muted-foreground">Description of how your task will be executed</p>
        {taskPrompt}
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Schedule Type</h3>
        <p className="text-[0.8rem] text-muted-foreground">Description of the schedule type</p>
        <p className="break-words">{schedulePrompt.Occurrence}</p>
        <div className="space-y-2">
          <h3 className="font-semibold">Schedule Prompt</h3>
          <p className="text-[0.8rem] text-muted-foreground">Description of the schedule for your task</p>
          <p className="break-words">{schedulePrompt.Prompt}</p>
        </div>
      </div>
    </div>
  )
}