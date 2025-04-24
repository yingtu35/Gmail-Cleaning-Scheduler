import {
  FormValues,
  AIPromptValues,
  SchedulePromptType,
} from '@/app/lib/definitions';
import { FormWrapper } from './formWrapper';
import { ScheduleDetail, TaskDetail } from './reviewForm';
import { useState } from 'react';
import { generateScheduleByPrompt } from '@/app/lib/actions';

type ReviewFormAIProps = {
  formValues: FormValues;
  aiPromptValues: AIPromptValues;
  updateFields: (fields: FormValues) => void;
  isResultGenerated: boolean;
  setIsResultGenerated: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ReviewFormAI({
  formValues,
  aiPromptValues,
  updateFields,
  isResultGenerated,
  setIsResultGenerated
}: ReviewFormAIProps) {
  const [error, setError] = useState<string | null>(null);
  const promptEntries = Object.entries(aiPromptValues)

  // convert formValues to an array of key-value pairs
  const aggregatedEntries = Object.entries(formValues)
  // extract the first 3 entries
  const scheduleEntries = aggregatedEntries.slice(0, 3)
  const taskEntries = aggregatedEntries.slice(3)

  async function onGenerate() {
    alert('Generating Schedule');
    // TODO: Call action to generate schedule
    const result = await generateScheduleByPrompt(aiPromptValues);
    if (typeof result === "string") {
      setError(result);
    } else {
      setIsResultGenerated(true);
      updateFields(result);
    }
  }
  return (
    <FormWrapper title="Schedule Review">
      <PromptDetail promptEntries={promptEntries} />
      {isResultGenerated ? (
        <>
          <ScheduleDetail scheduleEntries={scheduleEntries} />
          <TaskDetail taskEntries={taskEntries} />
        </>
      ) : (
        <GenerateScheduleForm onGenerate={onGenerate} error={error} />
      )}
    </FormWrapper>
  )
}

function GenerateScheduleForm({
  onGenerate,
  error
}: {
  onGenerate: () => void;
  error: string | null;
}) {
  return (
    <>
      <div>
        <p className="font-light">Generate Schedule from Prompt</p>
        <button
          type="button"
          onClick={onGenerate}
          className={`bg-blue-600 text-white px-4 py-2 rounded-md`}
        >
          Generate
        </button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
    </>
  )
}

function PromptDetail({
  promptEntries
}: {
  promptEntries: [string, string | SchedulePromptType][]
}) {
  return (
    <div className="space-y-4 p-4 border">
      <h3 className="text-2xl">Prompt Detail</h3>
      <div className="grid grid-cols-3 gap-2">
        {promptEntries.map(([key, value]) => {
          if (typeof value === "object") {
            return (
              <RenderSchedulePrompt key={key} value={value} />
            )
          } else {
            return (
              <RenderValuePrompt key={key} keyField={key} value={value} />
            )
          }
        })}
      </div>
    </div>
  )
}

function RenderValuePrompt({ keyField, value }: { keyField: string, value: any }) {
  return (
    <div>
      <p className="font-light">{keyField}</p>
      <p className="break-words">{String(value) === "" ? "-" : String(value)}</p>
    </div>
  )
}

function RenderSchedulePrompt({ value }: { value: SchedulePromptType }) {
  const { isOneTime, oneTimePrompt, recurringPrompt } = value;
  return (
    <>
      <RenderValuePrompt keyField='Recurring Type' value={isOneTime ? "One Time" : "Recurring"} />
      {isOneTime ? (
        <RenderValuePrompt keyField='One-time Prompt' value={oneTimePrompt} />
      ) : (
        <RenderValuePrompt keyField='Recurring Prompt' value={recurringPrompt} />
      )}
    </>
  )
}