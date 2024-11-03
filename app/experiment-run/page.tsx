'use client';

import Link from 'next/link';
import { ChatInterface } from '../components/ChatInterface';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import ChatList from '../components/ChatList';

export default function ExperimentRun() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Experiment Run</h1>
      <div>
        <Link href="/experiment-scoring" className="text-blue-600 hover:text-blue-800 underline mb-4 inline-block">
            Scoring
        </Link>
      </div>
      <Sheet>
        <SheetTrigger>Results</SheetTrigger>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Experiment Results</SheetTitle>
            <SheetDescription>
              User input from step one, then from model prompts. All content is volitile with IndexedDB storage.
            </SheetDescription>
            <ChatList />
          </SheetHeader>
        </SheetContent>
      </Sheet>
      <ChatInterface />
    </div>
  );
}
