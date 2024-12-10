'use client';

import { useEffect, useState } from 'react';
import { db, Experiment, Chat } from '../lib/db';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function ExperimentResults() {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [sortOrder, setSortOrder] = useState<string>('newest');

  useEffect(() => {
    async function fetchData() {
      const fetchedExperiments = await db.getAllExperiments();
      setExperiments(fetchedExperiments);

      const fetchedChats = await db.getAllChats();
      setChats(fetchedChats);
    }

    fetchData();
  }, []);

  const sortedExperiments = [...experiments].sort((a, b) => {
    if (sortOrder === 'newest') {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    } else if (sortOrder === 'oldest') {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    }
    return 0;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-5xl md:text-7xl font-extrabold mb-5 animate-fade-in-up">
        Basic Experiment Results
      </h1>
      <p>View all basic experiment results.  Sort from newest to oldest.</p>
      <div className="flex justify-end mb-4">
        <Select onValueChange={setSortOrder} defaultValue={sortOrder}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {sortedExperiments.length === 0 ? (
        <p>No experiment results available.</p>
      ) : (
        sortedExperiments.map((experiment: Experiment) => (
        <div key={experiment.id} className="mb-8 p-4 border rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Experiment {experiment.id}</h2>
          <p><strong>LLM:</strong> {experiment.llm}</p>
          <p><strong>Description:</strong> {experiment.description}</p>
          <p><strong>Timestamp:</strong> {new Date(experiment.timestamp).toLocaleString()}</p>
          
          <h3 className="text-xl font-semibold mt-4 mb-2">Run History</h3>
          {chats
            .filter(chat => chat.experimentId === experiment.id)
            .map((chat) => (
              <div key={chat.id} className="mb-4 p-2 border-t">
                <p><strong>Input:</strong> {chat.input}</p>
                <p><strong>Output:</strong> {chat.content}</p>
                {/* <p><strong>LLM:</strong> {chat.llm.join(', ')}</p> */}
                <p><strong>Timestamp:</strong> {new Date(chat.timestamp).toLocaleString()}</p>
                {chat.scores && (
                  <div>
                    <p><strong>Scores:</strong></p>
                    <ul>
                      <li>Accuracy: {chat.scores.accuracy}</li>
                      <li>Relevancy: {chat.scores.relevancy}</li>
                      <li>Quality: {chat.scores.quality}</li>
                      <li>Factuality: {chat.scores.factuality}</li>
                    </ul>
                  </div>
                )}
              </div>
            ))
          }
        </div>
      ))
    )}
    </div>
  );
}