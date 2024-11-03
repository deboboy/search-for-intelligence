import React, { useEffect, useState } from 'react';
import { db2 } from '../lib/db2';

interface Scores {
  accuracy: number;
  relevancy: number;
  quality: number;
  factuality: number;
}

interface ScoreDisplayProps {
    scores: Scores;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ scores }) => {
    const [localScores, setLocalScores] = useState<Scores | null>(null);

  useEffect(() => {
    const fetchLatestScores = async () => {
      try {
        const allChats = await db2.getAllChats();
        const latestChat = allChats[allChats.length - 1];
        if (latestChat && latestChat.scores) {
          setLocalScores(latestChat.scores);
        }
      } catch (error) {
        console.error('Error fetching scores:', error);
      }
    };

    fetchLatestScores();
  }, []);

  if (!scores) {
    return <div>No scores available</div>;
  }

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Latest Scores</h3>
      <ul className="space-y-1">
        <li>Accuracy: {scores.accuracy.toFixed(2)}</li>
        <li>Relevancy: {scores.relevancy.toFixed(2)}</li>
        <li>Quality: {scores.quality.toFixed(2)}</li>
        <li>Factuality: {scores.factuality.toFixed(2)}</li>
      </ul>
    </div>
  );
};

export default ScoreDisplay;