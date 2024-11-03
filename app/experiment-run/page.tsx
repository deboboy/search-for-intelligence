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
import { useEffect, useState } from 'react';
import { db2 } from '../lib/db2';
import LLMEvaluationScoring from "../components/Scoring";
import ChatList from '../components/ChatList';

export default function ExperimentRun() {
    const [latestChatId, setLatestChatId] = useState<number | null>(null);

    useEffect(() => {
        async function fetchLatestChatId() {
          const chats = await db2.getAllChats();
          if (chats.length > 0) {
            setLatestChatId(chats[chats.length - 1].id!);
          }
        }
        fetchLatestChatId();
      }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Experiment Run</h1>
      <Sheet>
        <SheetTrigger>Summary</SheetTrigger>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Experiment Summary</SheetTitle>
            <SheetDescription>
              User input from step one, then from model prompts. All content is volitile with IndexedDB storage.
            </SheetDescription>
            <ChatList />
          </SheetHeader>
        </SheetContent>
      </Sheet>
      <div className="flex flex-row space-x-4">
        <div className="w-1/2">
          <ChatInterface />
        </div>
        <div className="w-1/2">
            {latestChatId !== null && <LLMEvaluationScoring chatId={latestChatId} />}
        </div>
      </div>
    </div>
  );
}
