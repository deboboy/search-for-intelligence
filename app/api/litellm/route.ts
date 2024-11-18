import { NextRequest, NextResponse } from 'next/server';

if (!process.env.LITELLM_API_URL) {
  throw new Error('LITELLM_API_URL is not set in the environment variables');
}

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();
    const lastMessage = messages[messages.length - 1];
    const prompt = lastMessage.content;

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const response = await fetch(process.env.LITELLM_API_URL + '/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }]
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.choices[0].message.content;

    return NextResponse.json({ role: 'assistant', content: generatedText });
  } catch (error) {
    console.error('Error calling LiteLLM:', error);
    return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 });
  }
}