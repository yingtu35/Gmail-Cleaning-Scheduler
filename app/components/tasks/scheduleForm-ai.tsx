import { useState } from 'react';

function OneTimeFormAI({ isOneTime } : { isOneTime: boolean }) {
  return (
    <div className={`${isOneTime ? "opacity-100" : "opacity-0" } space-y-2 transition ease-in-out duration-500`}>
      <p className="text-lg font-medium">When do you want to schedule your task?</p>
      <p className="text-gray-600">Hint: being specific down to hours and minutes is recommended</p>
      <textarea
        placeholder="e.g. 2024-12-31 23:59, 3 days from now, same time next month, etc."
        className="border p-2 w-full h-24 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
      />
    </div>
  )
}

function RecurringFormAI({ isOneTime } : { isOneTime: boolean }) {
  return (
    <div className={`${isOneTime ? "opacity-0" : "opacity-100" } space-y-2 transition ease-in-out duration-500`}>
      <p className="text-lg font-medium">How often do you want to repeat this schedule?</p>
      <p className="text-gray-600">Hint: You can also specify when to start and end the schedule!</p>
      <textarea
        placeholder="e.g. every 3 months, starting from next month, and ending in 6 months"
        className="border p-2 w-full h-24 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
      />
    </div>
  )
}

export default function ScheduleFormAI() {
  const [ isOneTime, setIsOneTime ] = useState(true);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md space-y-6">
        {/* Choose between One-time schedule or Recurring schedule */}
        <div className="space-y-2">
          <p className="text-lg font-medium">Do you want your schedule one-time only or recurring?</p>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setIsOneTime(true)}
              className={`flex-1 p-2 rounded-lg focus:outline-none focus:ring-2 ${isOneTime ? 'bg-blue-500 text-white' : 'border'} transition-colors`}
            >
              One-time
            </button>
            <button
              type="button"
              onClick={() => setIsOneTime(false)}
              className={`flex-1 p-2 rounded-lg focus:outline-none focus:ring-2 ${!isOneTime ? 'bg-blue-500 text-white' : 'border'} transition-colors`}
            >
              Recurring
            </button>
          </div>
        </div>
        { isOneTime ? <OneTimeFormAI isOneTime={isOneTime} /> : <RecurringFormAI isOneTime={isOneTime} /> }
      </div>
    </div>
  )
}