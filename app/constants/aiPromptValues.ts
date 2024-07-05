import {
  AIPromptValues
} from '@/app/lib/definitions';

export const INITIAL_AI_STATE: AIPromptValues = {
  taskPrompt: 'emails from John Doe, and sizes greater than 1MB',
  schedulePrompt: {
    isOneTime: false,
    oneTimePrompt: '3 days from now',
    recurringPrompt: 'starting from next month, and ending in 6 months'
  }
}