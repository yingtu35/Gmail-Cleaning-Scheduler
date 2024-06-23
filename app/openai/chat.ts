import { openai } from "./client";

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

export async function getScheduleByPrompt(prompt: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an assistant specializing in scheduling. Create a json object like  based on the following prompt.",
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