'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { AlertCircle, Save } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { db2, Chat } from '../lib/db2';

interface ScoringProps {
  chatId: number;
}

const LLMEvaluationScoring: React.FC<ScoringProps> = ({ chatId }) => {
    const [scores, setScores] = useState({
        accuracy: 0.5,
        relevancy: 0.5,
        quality: 0.5,
        factuality: 0.5
    });
    const [dbStatus, setDbStatus] = useState('');
    const [chat, setChat] = useState<Chat | null>(null);
    // Update scores
    const handleScoreChange = (metric: string, value: string) => {
        setScores(prevScores => ({ ...prevScores, [metric]: value }));
    };

  useEffect(() => {
    loadChat();
  }, [chatId]);

  const loadChat = async () => {
    try {
      const loadedChat = await db2.getChatById(chatId);
      setChat(loadedChat);
      if (loadedChat?.scores) {
        setScores(loadedChat.scores);
      }
    } catch (error) {
      setDbStatus('Error loading chat');
    }
  };

  const handleSliderChange = (metric: keyof typeof scores, newValue: number[]) => {
    setScores(prev => ({
      ...prev,
      [metric]: newValue[0]
    }));
  };

  const saveEvaluation = async () => {
    try {
      const scoresToSave = {
        accuracy: scores.accuracy,
        relevancy: scores.relevancy,
        quality: scores.quality,
        factuality: scores.factuality,
      };
      
      await db2.updateChatScores(chatId, scoresToSave);
      setDbStatus('Evaluation saved successfully');
      await loadChat(); // Reload the chat to confirm the update
    } catch (error) {
      console.error('Error saving evaluation:', error);
      setDbStatus('Error saving evaluation');
    }
  };

  if (!chat) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        {/* <CardTitle className="text-2xl">LLM Evaluation Scoring</CardTitle> */}
        {chat && (
            <div>
            <p>LLM: {chat.llm.join(', ')}</p>
            <p>Input: {chat.input}</p>
            </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(scores).map(([metric, value]) => (
          <div key={metric} className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="capitalize">{metric}</label>
              <span className="text-sm font-mono">{value.toFixed(2)}</span>
            </div>
            <Slider
              value={[value]}
              min={0}
              max={1}
              step={0.01}
              className="w-full"
              onValueChange={(newValue) => handleSliderChange(metric as keyof typeof scores, newValue)}
            />
          </div>
        ))}

        <div className="flex justify-between items-center pt-4">
          <Button
            onClick={saveEvaluation}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Evaluation
          </Button>
          
          {dbStatus && (
            <Alert className="w-auto">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>{dbStatus}</AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LLMEvaluationScoring;