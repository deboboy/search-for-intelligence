// components/PromptForm.tsx
'use client';

import { useState } from 'react';
import { db } from '../lib/db';

export default function PromptForm({ onPromptAdded }: { onPromptAdded: () => void }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await db.addPrompt({
        title: formData.title,
        content: formData.content,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      });
      
      setFormData({ title: '', content: '', tags: '' });
      onPromptAdded();
    } catch (error) {
      console.error('Failed to save prompt:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-8">
      <div>
        <label htmlFor="title" className="text-white block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          className="text-black mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="content" className="text-white block text-sm font-medium text-gray-700">
          Prompt
        </label>
        <textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
          className="text-black mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={4}
          required
        />
      </div>

      <div>
        <label htmlFor="tags" className="text-white block text-sm font-medium text-gray-700">
          Tags (comma separated)
        </label>
        <input
          type="text"
          id="tags"
          value={formData.tags}
          onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
          className="text-black mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Save
      </button>
    </form>
  );
}