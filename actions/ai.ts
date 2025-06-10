'use server'

import { getScheduleByPrompt } from "@/libs/openai/chat";
import { UserDateTimePromptType } from "@/types/user";
import { AIPromptType, FormValues } from "@/types/task";
import { parseJsonToFormValues } from "@/utils/schedule";

export async function generateScheduleByPrompt(userDateTimePrompt: UserDateTimePromptType, prompt: AIPromptType): Promise<FormValues | string>{
    const result = await getScheduleByPrompt(userDateTimePrompt, prompt);
    if (!result) {
      return "Sorry, There was an error processing your request. Please try again later.";
    }
    const formValues = parseJsonToFormValues(result);
    return formValues;
} 