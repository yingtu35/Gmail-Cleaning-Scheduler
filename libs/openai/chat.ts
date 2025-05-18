import { openai } from "./client";
import { SYSTEM_PROMPT } from "./prompts";
import { AIPromptType } from '@/types/task';
import { UserDateTimePromptType } from "@/types/user";

import log from "@/utils/log";

export async function getScheduleByPrompt(userDateTimePrompt: UserDateTimePromptType, prompt: AIPromptType) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: JSON.stringify(userDateTimePrompt),
        },
        {
          role: "user",
          content: JSON.stringify(prompt),
        },
      ],
      response_format: {
        "type": "json_object",
      }
    })
    log.debug("response", response);
    return response.choices[0].message.content;
  } catch (error) {
    log.error("error", error);
    return null
  }
}

export async function getTaskByPrompt(prompt: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an assistant specializing in tasks. Create a json object like  based on the following prompt.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: {
        "type": "json_object",
      }
    })
    log.debug("response", response);
    return response.choices[0].message.content;
  } catch (error) {
    log.error("error", error);
    return "Sorry, There was an error processing your request. Please try again later."
  }
}