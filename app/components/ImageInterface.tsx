'use client';

import { useState } from "react";
import Image from "next/image";
import { db } from '../lib/db';

type ImageInterfaceProps = {
  onChatSubmit: (newChatId: number) => void;
  experimentId: number;
  llm: string;
  apiRoute: string;
};

// Add this type definition
type Prediction = {
  id?: string;
  status: 'starting' | 'processing' | 'succeeded' | 'failed';
  output?: string[];
  detail?: string;
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function ImageInterface({ onChatSubmit, experimentId, llm, apiRoute }: ImageInterfaceProps) {
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const prompt = formData.get('prompt') as string;

    try {
      const response = await fetch(apiRoute, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      let prediction = await response.json();
      if (response.status !== 201) {
        setError(prediction.detail);
        return;
      }
      setPrediction(prediction);

      while (
        prediction.status !== "succeeded" &&
        prediction.status !== "failed"
      ) {
        await sleep(1000);
        const response = await fetch(`${apiRoute}/${prediction.id}`);
        prediction = await response.json();
        if (response.status !== 200) {
          setError(prediction.detail);
          return;
        }
        console.log({ prediction: prediction });
        setPrediction(prediction);
      }

      if (prediction.status === "succeeded" && prediction.output) {
        const imageUrl = prediction.output[prediction.output.length - 1];
        
        // Update the experiment with the new image URL
        await db.updateExperimentImageUrl(experimentId, imageUrl);

        // Add a new chat entry
        const newChatId = await db.addChat({
          input: prompt,
          content: "Image generated successfully",
          llm: [llm],
          experimentId: experimentId,
          imageUrl: imageUrl,
          timestamp: new Date().toISOString(),
        });

        // Notify parent component about the new chat
        onChatSubmit(newChatId);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while generating the image.');
    }
  };

  return (
    <div className="container max-w-2xl mx-auto p-5">
      <form className="w-full flex" onSubmit={handleSubmit}>
        <input
          type="text"
          className="flex-grow border rounded-l-lg p-2"
          name="prompt"
          placeholder="Enter a prompt to generate an image"
        />
        <button 
          className="bg-black text-white rounded-r-lg px-4 py-2" 
          type="submit"
        >
          Send
        </button>
      </form>

      {error && <div className="text-red-500 mt-2">{error}</div>}

      {prediction && (
        <>
          {prediction.output && (
            <div className="image-wrapper mt-5">
              <Image
                src={prediction.output[prediction.output.length - 1]}
                alt="Generated image"
                sizes="100vw"
                height={768}
                width={768}
              />
            </div>
          )}
          <p className="py-3 text-sm opacity-50">status: {prediction.status}</p>
        </>
      )}
    </div>
  );
}