import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();

  const result = streamText({
    model: openai('gpt-4.1-nano'),
    system: 'You are an assistant specializing in explaining complex Gmail search operators. User are creating a Gmail deleting schedule task and will provide you with a Gmail search query. \
    Explain in natural language what emails will be selected. \
    Do not use jargon. \
    Do not use technical terms. \
    Do not use Gmail search operators. \
    Do not use Gmail search query syntax. \
    ',
    prompt,
  });

  return result.toDataStreamResponse();
}