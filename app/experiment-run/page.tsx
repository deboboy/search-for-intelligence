'use client';

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
    const [currentChatId, setCurrentChatId] = useState<number | null>(null);

    useEffect(() => {
        async function fetchCurrentChatId() {
          const chats = await db2.getAllChats();
          if (chats.length > 0) {
            setCurrentChatId(chats[chats.length - 1].id!);
          }
        }
        fetchCurrentChatId();
    }, []);

    // Function to be called when a new chat is submitted
    const handleChatSubmit = (newChatId: number) => {
        setCurrentChatId(newChatId);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold">Experiment Run</h1>
            <Sheet>
                <SheetTrigger>View Summary</SheetTrigger>
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
            <div className="flex flex-row space-x-4 mt-6">
                <div className="w-1/2">
                    <ChatInterface onChatSubmit={handleChatSubmit} />
                </div>
                <div className="w-1/2">
                    <LLMEvaluationScoring chatId={currentChatId} />
                </div>
            </div>
        </div>
    );
}