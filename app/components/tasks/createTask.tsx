"use client"

import { useState } from 'react';
import CreateForm from './create-form';
import CreateFormAI from './create-form-ai';

export default function CreateTask() {
  const [isAIGenerated, setIsAIGenerated] = useState<Boolean | null>(null);

  function resetIsAIGenerated() {
    setIsAIGenerated(null);
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
    <CreateFormAI onReselect={resetIsAIGenerated}  />
  ) : (
    <CreateForm onReselect={resetIsAIGenerated} />
  );
}