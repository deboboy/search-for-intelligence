'use client';

import { useEffect, useState } from 'react';
import { db2, Experiment, Chat } from '../lib/db2';

export default function ExperimentResults() {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    async function fetchData() {
      const fetchedExperiments = await db2.getAllExperiments();
      setExperiments(fetchedExperiments);

      const fetchedChats = await db2.getAllChats();
      setChats(fetchedChats);
    }

    fetchData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Experiment Results</h1>
      {experiments.length === 0 ? (
        <p>No experiment results available.</p>
      ) : (
        experiments.map((experiment) => (
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
                <p><strong>Content:</strong> {chat.content}</p>
                <p><strong>LLM:</strong> {chat.llm.join(', ')}</p>
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