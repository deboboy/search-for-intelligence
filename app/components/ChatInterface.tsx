'use client';

import { useState, useEffect } from 'react';
import { useChat } from 'ai/react';
import { db2 } from '../lib/db2';

export function ChatInterface() {
    const [error, setError] = useState<string | null>(null);
    const { messages, input, handleSubmit: handleApiSubmit, setInput, setMessages } = useChat({
        api: '/api/huggingface',
        onError: (error) => {
            console.error('Chat error:', error);
            setError('An error occurred while sending the message. Please try again.');
        },
    });

    useEffect(() => {
        const loadLastChat = async () => {
            try {
                const chats = await db2.getAllChats();
                if (chats.length > 0) {
                    const lastChat = chats[chats.length - 1];
                    setInput(lastChat.input || '');
                }
            } catch (error) {
                console.error('Failed to load last chat:', error);
            }
        };

        loadLastChat();
    }, [setInput]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
    
        if (!input.trim()) {
            return;
        }
    
        const userMessage = { id: Date.now().toString(), role: 'user' as const, content: input };
        
        try {
            // Add user message to the chat
            setMessages((prevMessages) => [...prevMessages, userMessage]);
    
            // Clear input field
            setInput('');
    
            // Send request to the API
            const response = await fetch('/api/huggingface', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: [...messages, userMessage] }),
            });
    
            if (!response.ok) {
                throw new Error('Failed to get response from API');
            }

    
            const responseText = await response.text();
            console.log('Raw API response:', responseText);

            // Function to clean the response
            const cleanResponse = (text: string) => {
                return text.split('\n')
                    .map(line => line.split(':')[1] || '')
                    .join('')
                    .replace(/<\|user\|>/g, '')
                    .trim();
            };

            const content = cleanResponse(responseText);
            console.log('Cleaned content:', content);


            const aiMessage = { id: Date.now().toString(), role: 'assistant' as const, content };
    
            // Add AI response to the chat
            setMessages((prevMessages) => [...prevMessages, aiMessage]);
    
            // Create a new chat entry
            await db2.addChat({
                input: userMessage.content,
                content: aiMessage.content,
                llm: ['HuggingFace'], // Adjust as needed
                timestamp: new Date().toISOString()
            });
    
        } catch (error) {
            console.error('Error in chat submission:', error);
            setError('An error occurred while processing your message. Please try again.');
        }
    };

    return (
        <div className="flex flex-col h-screen max-w-xl mx-auto p-4">
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
            <div className="flex-1 overflow-y-auto mb-4 border-2 border-red-500">
                {messages.map((m) => (
                    <div key={m.id} className={`mb-4 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                        <span className={`inline-block p-2 rounded-lg ${m.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                            {m.content}
                        </span>
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit} className="flex border-2 border-green-500">
                <input
                    className="flex-1 border rounded-l-lg p-2"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                />
                <button className="bg-blue-500 text-white rounded-r-lg px-4 py-2" type="submit">
                    Send
                </button>
            </form>
        </div>
    );
}

async function openDB(name: string, version: number, options?: { upgrade?: (db: IDBDatabase) => void }) {
    return new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open(name, version);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
        if (options?.upgrade) {
            request.onupgradeneeded = () => options.upgrade!(request.result);
        }
    });
}