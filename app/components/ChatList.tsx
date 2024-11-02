// components/ChatList.tsx
'use client';

import { useEffect, useState } from 'react';
import { db2 } from '../lib/db2';

interface Chat {
  id: number;
  input: string;
  content: string;
  llm: string[];
  timestamp: string;
}

export default function ChatList() {
  const [chats, setChats] = useState<Chat[]>([]);

  const loadChats = async () => {
    try {
      const fetchedChats = await db2.getAllChats();
      setChats(fetchedChats.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ));
    } catch (error) {
      console.error('Failed to load chats:', error);
    }
  };

  useEffect(() => {
    loadChats();
  }, []);

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      alert('Chat copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy:', error);
      alert('Failed to copy prompt');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this chat?')) {
      try {
        await db2.deleteChat(id);
        await loadChats();
      } catch (error) {
        console.error('Failed to delete chat:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {chats.map(chat => (
        <div 
          key={chat.id}
          className="bg-white rounded-lg shadow-md p-6 space-y-4"
        >
          <h3 className="text-lg font-medium text-gray-900">{chat.input}</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{chat.content}</p>
          {chat.input.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {chat.llm.map(llm => (
                <span
                  key={llm}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {llm}
                </span>
              ))}
            </div>
          )}
          <div className="flex gap-4">
            <button
              onClick={() => handleCopy(chat.content)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Copy
            </button>
            <button
              onClick={() => handleDelete(chat.id)}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}