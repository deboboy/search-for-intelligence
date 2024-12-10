'use client';

import Link from "next/link"
import { useEffect, useState } from 'react';
import { db } from '../lib/db';
import LLMEvaluationScoring from "../components/Scoring";

export default function ExperimentScoring() {
    const [latestChatId, setLatestChatId] = useState<number | null>(null);

    useEffect(() => {
        async function fetchLatestChatId() {
        const chats = await db.getAllChats();
        if (chats.length > 0) {
            setLatestChatId(chats[chats.length - 1].id!);
        }
        }
        fetchLatestChatId();
    }, []);


    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Experiment Scoring</h1>
            {latestChatId !== null && <LLMEvaluationScoring chatId={latestChatId} />}
            <Link href="/experiment-results">Experiment Results</Link>
        </div>
    );
}
