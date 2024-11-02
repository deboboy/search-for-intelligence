'use client';

import { useState, useEffect } from 'react';
import { useChat } from 'ai/react';
import { db2 } from '../lib/db2';

export function ChatInterface() {
    const [error, setError] = useState<string | null>(null);
    const [shouldAddToDb, setShouldAddToDb] = useState(false);
    const { messages, input, handleInputChange, handleSubmit } = useChat({
        api: '/api/huggingface',
        onError: (error) => {
            console.error('Chat error:', error);
            setError('An error occurred while sending the message. Please try again.');
        },
    });

    useEffect(() => {
        console.log('Messages updated:', messages);
        if (shouldAddToDb && messages.length >= 2) {
            const userMessage = messages[messages.length - 2];
            const aiMessage = messages[messages.length - 1];
            if (userMessage.role === 'user' && aiMessage.role === 'assistant') {
                const newChat = {
                    input: userMessage.content,
                    content: aiMessage.content,
                    llm: ['HuggingFace'],
                    timestamp: new Date().toISOString()
                };
                console.log('Attempting to add chat:', newChat);
                db2.addChat(newChat)
                    .then(() => console.log('Chat added successfully'))
                    .catch((error) => console.error('Error adding chat to database:', error));
                setShouldAddToDb(false);
            }
        }
    }, [messages, shouldAddToDb]);

    useEffect(() => {
        const loadLastChat = async () => {
            try {
                const chats = await db2.getAllChats();
                if (chats.length > 0) {
                    const lastChat = chats[chats.length - 1];
                    // Note: We're not setting the input here as useChat manages it
                }
            } catch (error) {
                console.error('Failed to load last chat:', error);
            }
        };

        loadLastChat();
    }, []);

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        if (!input.trim()) return;

        try {
            await handleSubmit(e);
            setShouldAddToDb(true);
        } catch (error) {
            console.error('Error in chat submission:', error);
            setError('An error occurred while processing your message. Please try again.');
        }
    };

    return (
        <div className="flex flex-col h-screen max-w-xl mx-auto p-4">
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
            <div className="flex-1 overflow-y-auto mb-4">
                {messages.map((m) => (
                    <div key={m.id} className={`mb-4 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                        <span className={`inline-block p-2 rounded-lg ${m.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
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
                <button className="bg-blue-500 text-white rounded-r-lg px-4 py-2" type="submit">
                    Send
                </button>
            </form>
        </div>
    );
}