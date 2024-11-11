'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from "next/image";
import { useRouter } from 'next/navigation';

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const splashTimer = setTimeout(() => setLoaded(true), 1000);
    const redirectTimer = setTimeout(() => router.push('/experiment-setup'), 3000);

    return () => {
      clearTimeout(splashTimer);
      clearTimeout(redirectTimer);
    };
  }, [router]);

  return (
    <>
      <Head>
        <title>Search for Intelligence: intro</title>
        <meta name="description" content="Search for artificial intelligence; experiments with open LLMs." />
        <meta name="keywords" content="AI, artificial intelligence, open LLMs, RAG" />
        {/* Add more metadata as needed */}
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-between">
        <div className={`transition-opacity duration-3000 ${loaded ? 'opacity-0' : 'opacity-100'}`}>
          <Image
            src="/173412_peep_hole_view_xl-1024-v1-0.png"
            alt="peep hole view into a dark classroom where all you can see is a chalkboard with several complex equations"
            quality="100"
            layout="fill" />
        </div>

        <div className={`font-aeonik flex flex-col items-center justify-center h-screen transition-opacity duration-1500 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-5 animate-fade-in-up">Search for Intelligence</h1>
          <p className="text-xl md:text-2xl mb-8 animate-fade-in-up animation-delay-200">Evaluate open source LLMs with scoring.</p>
        </div>
      </main>
    </>
  );
}