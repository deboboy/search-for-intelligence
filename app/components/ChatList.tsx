import { useEffect, useState } from 'react';
import { db, Chat } from '../lib/db';

interface ChatListProps {
  experimentId: number;
}

export function ChatList({ experimentId }: ChatListProps) {
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    async function fetchChats() {
      const allChats = await db.getAllChats();
      const experimentChats = allChats.filter(chat => chat.experimentId === experimentId);
      setChats(experimentChats);
    }
    fetchChats();
  }, [experimentId]);

  return (
    <div>
      <h3 className="font-bold mb-2">History</h3>
      {chats.map((chat) => (
        <div key={chat.id} className="mb-4 p-2 border rounded">
          <p><strong>Human input:</strong> {chat.input}</p>
          {/* <p><strong>LLM:</strong> {chat.llm.join(', ')}</p> */}
          <p><strong>LLM output:</strong> {chat.content}</p>
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
      ))}
    </div>
  );
}