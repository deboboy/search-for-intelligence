'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { db, Chat } from '../lib/db';

interface ScoringProps {
  chatId: number | null;
}

const LLMEvaluationScoring: React.FC<ScoringProps> = ({ chatId }) => {
    const [scores, setScores] = useState({
        accuracy: 0.5,
        relevancy: 0.5,
        quality: 0.5,
        factuality: 0.5
    });
    const [chat, setChat] = useState<Chat | null>(null);
    const { toast } = useToast()

    useEffect(() => {
        if (chatId !== null) {
          loadChat();
        }
    }, [chatId]);

    const loadChat = useCallback(async () => {
      if (chatId === null) return;
      try {
          const loadedChat = await db.getChatById(chatId);
          setChat(loadedChat);
          if (loadedChat?.scores) {
              setScores(loadedChat.scores);
          }
      } catch (error) {
          console.error('Error loading chat:', error);
      }
    }, [chatId]);

    useEffect(() => {
        if (chatId !== null) {
            loadChat();
        }
    }, [chatId, loadChat]);

  const handleSliderChange = (metric: keyof typeof scores, newValue: number[]) => {
    setScores(prev => ({
      ...prev,
      [metric]: newValue[0]
    }));
  };

  const saveEvaluation = async () => {
    try {
        if (chatId === null) {
          toast({
            title: "Error",
            description: "Cannot save: Chat ID is null",
            variant: "destructive",
          })
          return;
        }

        const scoresToSave = {
            accuracy: scores.accuracy,
            relevancy: scores.relevancy,
            quality: scores.quality,
            factuality: scores.factuality,
        };
      
        await db.updateChatScores(chatId, scoresToSave);
        toast({
          title: "Success",
          description: "Evaluation saved successfully",
        })
        await loadChat(); // Reload the chat to confirm the update
        } catch (error) {
        console.error('Error saving evaluation:', error);
        toast({
          title: "Error",
          description: "Error saving evaluation",
          variant: "destructive",
        })
        }
  };

  if (chatId === null || !chat) {
    return <div className="mt-5"></div>;
  }

  return (
    <Card className="w-full max-w-2xl mt-5">
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
            Save evaluation
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LLMEvaluationScoring;