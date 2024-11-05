import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const response = await fetch(
            "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
            {
                headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}` },
                method: "POST",
                body: JSON.stringify(data),
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(JSON.stringify(result));
        }
        
        // Format the response to match the expected streaming format
        const formattedResponse = {
            choices: [
                {
                    delta: { content: result[0].summary_text },
                    finish_reason: "stop"
                }
            ]
        };

        return NextResponse.json(formattedResponse);
    } catch (error) {
        console.error('Error in Hugging Face API:', error);
        return NextResponse.json({ error: 'An error occurred while processing your request.' }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
}