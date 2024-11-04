'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { db2, Experiment } from '../lib/db2';
import { ChatInterface } from '../components/ChatInterface';
import { ChatList } from '../components/ChatList';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import LLMEvaluationScoring from "../components/Scoring";

export default function ExperimentRun() {
  const [currentChatId, setCurrentChatId] = useState<number | null>(null);
  const [experiment, setExperiment] = useState<Experiment | null>(null);
  const searchParams = useSearchParams();
  const experimentId = Number(searchParams.get('id'));

  useEffect(() => {
    async function fetchExperiment() {
      if (experimentId) {
        const fetchedExperiment = await db2.getExperiment(experimentId);
        if (fetchedExperiment) {
          setExperiment(fetchedExperiment);
        }
      }
    }
    fetchExperiment();
  }, [experimentId]);

  const handleChatSubmit = (newChatId: number) => {
    setCurrentChatId(newChatId);
  };

  if (!experiment) {
    return <div>Loading experiment...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Experiment Run</h1>
      <Sheet>
        <SheetTrigger>View Summary</SheetTrigger>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Experiment Summary</SheetTitle>
            <SheetDescription>
              Setup and a summary of results available here.  Detailed results available from a link within each card set below.
            </SheetDescription>
            <div className="mb-4">
              <h3 className="font-bold">Experiment Setup</h3>
              <p>LLM: {experiment.llm}</p>
              <p>Description: {experiment.description}</p>
              <p>Timestamp: {experiment.timestamp}</p>
            </div>
            <ChatList experimentId={experiment.id!} />
          </SheetHeader>
        </SheetContent>
      </Sheet>
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mt-6">
      <div className="w-full md:w-1/2">
          <ChatInterface onChatSubmit={handleChatSubmit} experimentId={experiment.id!} />
        </div>
        <div className="w-full md:w-1/2">
          <LLMEvaluationScoring chatId={currentChatId} />
        </div>
      </div>
    </div>
  );
}