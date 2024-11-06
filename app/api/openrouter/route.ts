import { NextRequest } from 'next/server';
import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

const apiKey = process.env.OPENROUTER_API_KEY || '';
const maskedKey = apiKey.slice(0, 4) + '*'.repeat(Math.max(0, apiKey.length - 8)) + apiKey.slice(-4);

console.log('Using OpenRouter API key:', maskedKey);

if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not set in the environment variables');
}

const openrouter = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: apiKey,
    dangerouslyAllowBrowser: true
});

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const response = await openrouter.chat.completions.create({
    model: 'qwen/qwen-2.5-7b-instruct',
    messages,
    stream: true,
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}