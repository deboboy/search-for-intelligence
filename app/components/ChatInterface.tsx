'use client';

import { useState, useEffect, useRef } from 'react';
import { useChat } from 'ai/react';
import { db } from '../lib/db';

interface ChatInterfaceProps {
    onChatSubmit?: (newChatId: number) => void;
    experimentId: number;
    llm: string;
    apiRoute: string;
}

// Add this type definition
type ChatOptions = {
    api: string;
    body: {
      system_prompt?: string;
      prompt?: string;
    };
    onFinish: (message: { content: string }) => void;
    onError: (error: Error) => void;
};

export default function ChatInterface({ onChatSubmit, experimentId, llm, apiRoute }: ChatInterfaceProps) {
    const [error, setError] = useState<string | null>(null);
    const [shouldAddToDb, setShouldAddToDb] = useState(false);
    const latestMessageRef = useRef<string>('');
    
    const chatOptions: ChatOptions = {
        api: apiRoute,
        body: {}, // Initialize an empty body object
        onFinish: (message: { content: string }) => {
            console.log('Received message:', message);
            latestMessageRef.current = message.content;
            setShouldAddToDb(true);
        },
        onError: (error: Error) => {
            console.error('Chat error:', error);
            setError('An error occurred while sending the message. Please try again.');
        },
    };

    const { messages, input, handleInputChange, handleSubmit } = useChat({
        api: apiRoute,
        onFinish: (message) => {
            console.log('Received message:', message);
            latestMessageRef.current = message.content;
            setShouldAddToDb(true);
        },
        onError: (error) => {
            console.error('Chat error:', error);
            setError('An error occurred while sending the message. Please try again.');
        },
    });

    // Only add system_prompt and prompt for Replicate
    if (apiRoute === '/api/replicate-text') {
        chatOptions.body = {
            system_prompt: "You are a helpful AI assistant.",
        };
    }

    // Add this useEffect to update the prompt dynamically
    useEffect(() => {
        if (apiRoute === '/api/replicate-text') {
            chatOptions.body.prompt = input;
        }
    }, [input, apiRoute]);

    useEffect(() => {
        if (shouldAddToDb && messages.length >= 2) {
            const userMessage = messages[messages.length - 2];
            const aiMessageContent = latestMessageRef.current;
            if (userMessage.role === 'user' && aiMessageContent) {
                const newChat = {
                    input: userMessage.content,
                    content: aiMessageContent,
                    llm: [llm],
                    experimentId: experimentId,
                    timestamp: new Date().toISOString()
                };
                console.log('Attempting to add chat:', newChat);
                db.addChat(newChat)
                    .then((chatId) => {
                        console.log('Chat added successfully');
                        if (onChatSubmit && typeof chatId === 'number') {
                            onChatSubmit(chatId);
                        }
                    })
                    .catch((error) => console.error('Error adding chat to database:', error));
                setShouldAddToDb(false);
            }
        }
    }, [messages, shouldAddToDb, onChatSubmit, experimentId, llm]);

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        if (!input.trim()) return;

        try {
            console.log('Submitting with options:', chatOptions); // Add this line
            await handleSubmit(e);
        } catch (error) {
            console.error('Error in chat submission:', error);
            setError('An error occurred while processing your message. Please try again.');
        }
    };

    return (
        <div className="flex flex-col max-w-xl mx-auto p-4 rounded-xl border bg-card text-card-foreground shadow mt-5">
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
            <div className="flex-1 overflow-y-auto mb-4">
                {messages.map((m) => (
                    <div key={m.id} className={`mb-4 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                        <span className={`inline-block p-2 rounded-lg ${m.role === 'user' ? 'bg-black text-white' : 'bg-gray-200'}`}>
                            {m.content}
                        </span>
                    </div>
                ))}
            </div>
            <form onSubmit={handleFormSubmit} className="flex">
                <input
                    className="flex-1 border rounded-l-lg p-2"
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Enter a prompt to generate text..."
                />
                <button className="bg-black text-white rounded-r-lg px-4 py-2" type="submit">
                    Send
                </button>
            </form>
        </div>
    );
}