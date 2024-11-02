// components/PromptList.tsx
'use client';

import { useEffect, useState } from 'react';
import { db } from '../lib/db';

interface Prompt {
  id: number;
  title: string;
  content: string;
  tags: string[];
  timestamp: string;
}

export default function PromptList() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);

  const loadPrompts = async () => {
    try {
      const fetchedPrompts = await db.getAllPrompts();
      setPrompts(fetchedPrompts.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ));
    } catch (error) {
      console.error('Failed to load prompts:', error);
    }
  };

  useEffect(() => {
    loadPrompts();
  }, []);

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      alert('Prompt copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy:', error);
      alert('Failed to copy prompt');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this prompt?')) {
      try {
        await db.deletePrompt(id);
        await loadPrompts();
      } catch (error) {
        console.error('Failed to delete prompt:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {prompts.map(prompt => (
        <div 
          key={prompt.id}
          className="bg-white rounded-lg shadow-md p-6 space-y-4"
        >
          <h3 className="text-lg font-medium text-gray-900">{prompt.title}</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{prompt.content}</p>
          {prompt.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {prompt.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div className="flex gap-4">
            <button
              onClick={() => handleCopy(prompt.content)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Copy
            </button>
            <button
              onClick={() => handleDelete(prompt.id)}
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