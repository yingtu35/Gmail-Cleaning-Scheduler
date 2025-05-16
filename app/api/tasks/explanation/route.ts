import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();

  const result = streamText({
    model: openai('gpt-4.1-nano'),
    system: 'You are an assistant specializing in explaining complex Gmail search operators. User are creating a Gmail deleting schedule task and will provide you with a Gmail search query. \
    Explain how user\'s provided Gmail search query will work \
    i.e. what emails will be selected by the query and scheduled to be deleted',
    prompt,
  });

  return result.toDataStreamResponse();
}