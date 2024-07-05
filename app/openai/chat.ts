import { openai } from "./client";
import { PROMPT_TYPES } from "@/app/data/prompt-types";
import { QUERY_TEMPLATE } from "../constants/formValues";
import {
  AIPromptValues
} from '@/app/lib/definitions';

export async function getEmailSearchesExplanation(query: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an assistant specializing in explaining complex Gmail search operators. Explain in one sentence without using jargon.",
        },
        {
          role: "user",
          content: query,
        },
      ],
    })
    console.log("response", response);
    return response.choices[0].message.content;
  } catch (error) {
    console.error("error", error);
    return "Sorry, There was an error processing your request. Please try again later."
  }
}

export async function getScheduleByPrompt(prompt: AIPromptValues) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an assistant specializing in forming JSON object. You will be given a TypeScript type called FormValues representing the format you should return, then a example json object, then another json object containing the prompt. You must change the name and description field to summarize the json object you created. Other fields should be unchanged as the example json object if it's not mentioned in the prompt.",
        },
        {
          role: "user",
          content: PROMPT_TYPES,
        },
        {
          role: "user",
          content: JSON.stringify(QUERY_TEMPLATE.QUERY_EMPTY_FORM)
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
    console.log("response", response);
    return response.choices[0].message.content;
  } catch (error) {
    console.error("error", error);
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
    console.log("response", response);
    return response.choices[0].message.content;
  } catch (error) {
    console.error("error", error);
    return "Sorry, There was an error processing your request. Please try again later."
  }
}