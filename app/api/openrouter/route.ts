import { NextRequest } from 'next/server';
import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

// Move the API key check and OpenAI initialization inside the POST function
export async function POST(req: NextRequest) {
    const apiKey = process.env.OPENROUTER_API_KEY;
  
    if (!apiKey) {
        return new Response('OpenRouter API key not configured', { status: 500 });
    }

    const maskedKey = apiKey.slice(0, 4) + '*'.repeat(Math.max(0, apiKey.length - 8)) + apiKey.slice(-4);
    console.log('Using OpenRouter API key:', maskedKey);

    const openrouter = new OpenAI({
        baseURL: 'https://openrouter.ai/api/v1',
        apiKey: apiKey,
        dangerouslyAllowBrowser: true
    });

    const { messages } = await req.json();

    const response = await openrouter.chat.completions.create({
        model: 'qwen/qwen-2.5-7b-instruct',
        messages,
        stream: true,
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
}