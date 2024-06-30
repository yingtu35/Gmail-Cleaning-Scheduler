import { useState } from 'react';
import { AIPromptValues, SchedulePromptType } from '@/app/lib/definitions';

type ScheduleFormAIProps = {
  schedulePrompt: SchedulePromptType;
  updatePromptFields: (fields: Partial<AIPromptValues>) => void;
}

export default function ScheduleFormAI({
  schedulePrompt,
  updatePromptFields,
}: ScheduleFormAIProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md space-y-6">
        {/* Choose between One-time schedule or Recurring schedule */}
        <div className="space-y-2">
          <p className="text-lg font-medium">Do you want your schedule one-time only or recurring?</p>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => updatePromptFields({ schedulePrompt: { ...schedulePrompt, isOneTime: true } })}
              className={`flex-1 p-2 rounded-lg focus:outline-none focus:ring-2 ${schedulePrompt.isOneTime ? 'bg-blue-500 text-white' : 'border'} transition-colors`}
            >
              One Time
            </button>
            <button
              type="button"
              onClick={() => updatePromptFields({ schedulePrompt: { ...schedulePrompt, isOneTime: false } })}
              className={`flex-1 p-2 rounded-lg focus:outline-none focus:ring-2 ${!schedulePrompt.isOneTime ? 'bg-blue-500 text-white' : 'border'} transition-colors`}
            >
              Recurring
            </button>
          </div>
        </div>
        { schedulePrompt.isOneTime ? 
          <OneTimeFormAI schedulePrompt={schedulePrompt} updatePromptFields={updatePromptFields} /> : 
          <RecurringFormAI schedulePrompt={schedulePrompt} updatePromptFields={updatePromptFields} /> 
        }
      </div>
    </div>
  )
}

function OneTimeFormAI({ 
  schedulePrompt,
  updatePromptFields 
} : ScheduleFormAIProps) {
  return (
    <div className={`${schedulePrompt.isOneTime ? "opacity-100" : "opacity-0" } space-y-2 transition ease-in-out duration-500`}>
      <p className="text-lg font-medium">When do you want to schedule your task?</p>
      <p className="text-gray-600">e.g. 2024-12-31 23:59, 3 days from now, same time next month, etc.</p>
      <textarea
        placeholder="Enter your schedule description here"
        value={schedulePrompt.oneTimePrompt}
        onChange={(e) => updatePromptFields({ schedulePrompt: { ...schedulePrompt, oneTimePrompt: e.target.value } })}
        className="border p-2 w-full h-24 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
      />
    </div>
  )
}

function RecurringFormAI({ 
  schedulePrompt,
  updatePromptFields 
} : ScheduleFormAIProps) {
  return (
    <div className={`${schedulePrompt.isOneTime ? "opacity-0" : "opacity-100" } space-y-2 transition ease-in-out duration-500`}>
      <p className="text-lg font-medium">How often do you want to repeat this schedule?</p>
      <p className="text-gray-600">e.g. every 3 months, starting from next month, and ending in 6 months</p>
      <textarea
        value={schedulePrompt.recurringPrompt}
        onChange={(e) => updatePromptFields({ schedulePrompt: { ...schedulePrompt, recurringPrompt: e.target.value } })}
        placeholder="Enter your schedule description here"
        className="border p-2 w-full h-24 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
      />
    </div>
  )
}