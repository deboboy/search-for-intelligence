'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1000); // splashscreen timer
    return () => clearTimeout(timer);
  }, []);

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
          <h1 className="font-aeonik text-black text-2xl mb-4">Search for Intelligence</h1>
          <Link href="/experiment-setup">
            <button
              className="px-4 py-2 ml-auto bg-black text-white font-semibold border-none shadow-lg transform transition-transform hover:scale-105"
            >
              BEGIN
            </button>
          </Link>
        </div>
      </main>
    </>
  );
}