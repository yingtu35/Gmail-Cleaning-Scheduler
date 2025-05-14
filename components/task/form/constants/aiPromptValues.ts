import {
  AIFormValues
} from '@/types/task';
import { QUERY_TEMPLATE } from './formValues';

export const INITIAL_AI_STATE: AIFormValues = {
  prompt: {
    taskPrompt: '',
    schedulePrompt: {
      Occurrence: 'One-time',
      Prompt: '3 days from now',
    },
  },
  formValues: {
    isGenerated: false,
    value: QUERY_TEMPLATE.QUERY_AI_TEMPLATE,
  }
}