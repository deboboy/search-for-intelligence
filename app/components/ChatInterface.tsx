'use client';

import { useState, useEffect, useRef } from 'react';
import { useChat } from 'ai/react';
import { db2 } from '../lib/db2';

interface ChatInterfaceProps {
    onChatSubmit?: (newChatId: number) => void;
    experimentId: number;
}

export function ChatInterface({ onChatSubmit, experimentId }: ChatInterfaceProps) {
    const [error, setError] = useState<string | null>(null);
    const [shouldAddToDb, setShouldAddToDb] = useState(false);
    const latestMessageRef = useRef<string>('');
    
    const { messages, input, handleInputChange, handleSubmit } = useChat({
        api: '/api/huggingface',
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

    useEffect(() => {
        if (shouldAddToDb && messages.length >= 2) {
            const userMessage = messages[messages.length - 2];
            const aiMessageContent = latestMessageRef.current;
            if (userMessage.role === 'user' && aiMessageContent) {
                const newChat = {
                    input: userMessage.content,
                    content: aiMessageContent,
                    llm: ['zephyr-7b-beta'],
                    experimentId: experimentId,
                    timestamp: new Date().toISOString()
                };
                console.log('Attempting to add chat:', newChat);
                db2.addChat(newChat)
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
    }, [messages, shouldAddToDb, onChatSubmit, experimentId]);

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        if (!input.trim()) return;

        try {
            await handleSubmit(e);
        } catch (error) {
            console.error('Error in chat submission:', error);
            setError('An error occurred while processing your message. Please try again.');
        }
    };

    return (
        <div className="flex flex-col max-w-xl mx-auto p-4 rounded-xl border bg-card text-card-foreground shadow">
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
                    placeholder="Type your message..."
                />
                <button className="bg-black text-white rounded-r-lg px-4 py-2" type="submit">
                    Send
                </button>
            </form>
        </div>
    );
}