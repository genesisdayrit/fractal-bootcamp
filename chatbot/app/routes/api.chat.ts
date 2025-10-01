// when you hit this endpoint, it should
// trigger an OpenAI response
// create a uuid for the chat id
// create a record in the chat table
// using the new created chat id it should also insert a record with the users message
// once the openai response is done, it should insert the record with the openai response

import type { ActionFunctionArgs } from "react-router";
import { openai } from '@ai-sdk/openai';
import { streamText, convertToModelMessages, type UIMessage } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function action({ request }: ActionFunctionArgs) {
  try {
    console.log('API action hit');
    
    const { messages }: { messages: UIMessage[] } = await request.json();
    console.log('Messages received:', messages);

    const result = streamText({
      model: openai('gpt-4o'),
      messages: convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Error in AI chat action:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}