"use client"

import { useState } from 'react';
import CreateForm from './create-form';
import CreateFormAI from './create-form-ai';
import {
  FormValues,
  AIPromptValues,
} from '@/app/lib/definitions';
import { INITIAL_STATE } from '@/app/data/form';


export default function CreateTask() {
  const [formValues, setFormValues] = useState<FormValues>(INITIAL_STATE);
  const [isAIGenerated, setIsAIGenerated] = useState<Boolean | null>(null);
  const [aiPromptValues, setAIPromptValues] = useState<AIPromptValues>({
    taskPrompt: '',
    schedulePrompt: {
      isOneTime: true,
      oneTimePrompt: '',
      recurringPrompt: '',
    }
  });

  function onSwitchForm() {
    setIsAIGenerated(!isAIGenerated);
  }

  if (isAIGenerated === null) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-100'>
        <div className='flex justify-center gap-16'>
          <div 
            onClick={() => setIsAIGenerated(false)}
            className="w-full max-w-lg p-8 bg-blue-500 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-blue-600 transition duration-200 cursor-pointer flex flex-col items-center justify-center space-y-8"
          >
            <div className="h-96 w-96 bg-blue-300 rounded-full"></div>
            <p className='text-4xl'>Build Your Own Task</p>
          </div>
          <div 
            onClick={() => setIsAIGenerated(true)}
            className="w-full max-w-md p-8 bg-green-500 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-green-600 transition duration-200 cursor-pointer flex flex-col items-center justify-center space-y-8"
          >
            <div className="h-96 w-96 bg-green-300 rounded-full"></div>
            <p className='text-4xl'>AI Assisted</p>
          </div>
        </div>
      </div>
    )
  }
  return isAIGenerated ? (
    <CreateFormAI 
      onSwitchForm={onSwitchForm}
      formValues={formValues}
      setFormValues={setFormValues}
      aiPromptValues={aiPromptValues}
      setAIPromptValues={setAIPromptValues}
    />
  ) : (
    <CreateForm 
      onSwitchForm={onSwitchForm}
      formValues={formValues}
      setFormValues={setFormValues}
    />
  );
}