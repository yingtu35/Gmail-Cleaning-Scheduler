import { AIPromptValues } from "@/app/lib/definitions";

import { FormWrapper } from "./formWrapper"


type TaskFormAIProps = {
  taskPrompt: string;
  updatePromptFields: (fields: Partial<AIPromptValues>) => void;
};

export default function TaskFormAI({
  taskPrompt,
  updatePromptFields
}: TaskFormAIProps) {
  return (
    <FormWrapper title="Describe your task">
      <div className="flex flex-col items-center justify-center bg-gray-100 p-4">
        <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md">
          <p className="text-xl font-semibold mb-2">What kind of emails would you like to delete?</p>
          <p className="text-gray-600 mb-4">e.g. emails from John Doe, and emails older than 3 months</p>
          <textarea 
            value={taskPrompt}
            onChange={(e) => updatePromptFields({ taskPrompt: e.target.value })}
            placeholder="Enter your task description here"
            className="border p-2 w-full h-40 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
          />
        </div>
      </div>
    </FormWrapper>
  )
}