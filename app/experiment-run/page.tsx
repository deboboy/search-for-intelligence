'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { db, Experiment } from '../lib/db';
import { ChatList } from '../components/ChatList';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button"; // Import Button component if not already imported
import LLMEvaluationScoring from "../components/Scoring";
import Link from 'next/link';

// Add this type definition
type ImageInterfaceProps = {
  onChatSubmit: (newChatId: number) => void;
  experimentId: number;
  llm: string;
  apiRoute: string;
  imageUrl?: string; // Add this line
};

// Modify the dynamic import to include the prop types
const ImageInterface = dynamic<ImageInterfaceProps>(() => import('../components/ImageInterface'))
const ChatInterface = dynamic(() => import('../components/ChatInterface'))


function ExperimentRunContent() {
    const [currentChatId, setCurrentChatId] = useState<number | null>(null);
    const [experiment, setExperiment] = useState<Experiment | null>(null);
    const searchParams = useSearchParams();
    const experimentId = Number(searchParams.get('id'));
    const llm = searchParams.get('llm') || '';
    const apiRoute = searchParams.get('apiRoute') || '';
    const isImageModel = searchParams.get('isImageModel') === 'true';

  useEffect(() => {
    async function fetchExperiment() {
      if (experimentId) {
        const fetchedExperiment = await db.getExperiment(experimentId);
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
      <h1 className="text-5xl md:text-7xl font-extrabold mb-5 animate-fade-in-up">
        Basic Experiment Run
      </h1>
      <p className="mb-4">Submit input to start the experiment run; then score the LLM output.</p>
      <div className="flex justify-end mb-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">View Experiment Summary</Button>
          </SheetTrigger>
          <SheetContent className="overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Basic Experiment Summary</SheetTitle>
              <SheetDescription>
                View summary of setup and results below for a single basic experiment.&nbsp;
                <Link href="/experiment-results" className="text-primary hover:underline">Experiment Results</Link>
              </SheetDescription>
              <div className="mb-4">
                <h3 className="font-bold">Setup</h3>
                <p>LLM: {experiment.llm}</p>
                <p>Description: {experiment.description}</p>
                <p>Timestamp: {experiment.timestamp}</p>
              </div>
              <ChatList experimentId={experiment.id!} />
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mt-6">
      <div className="w-full md:w-1/2">
        {isImageModel ? (
          <ImageInterface 
            onChatSubmit={handleChatSubmit} 
            experimentId={experiment.id!}
            llm={llm}
            apiRoute={apiRoute}
            imageUrl={experiment.imageUrl} // Add this line
          />
        ) : (
          <ChatInterface 
            onChatSubmit={handleChatSubmit} 
            experimentId={experiment.id!}
            llm={llm}
            apiRoute={apiRoute}
          />
        )}
      </div>
        <div className="w-full md:w-1/2">
          <LLMEvaluationScoring chatId={currentChatId} />
        </div>
      </div>
    </div>
  );
}

export default function ExperimentRun() {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <ExperimentRunContent />
      </Suspense>
    );
  }