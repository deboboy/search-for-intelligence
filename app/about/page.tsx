import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function About() {
  return (
    <div className="container mx-auto px-4 py-8">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-5 animate-fade-in-up">
          About
        </h1>
        <p className="text-xl md:text-2xl mb-8 animate-fade-in-up animation-delay-200">
          Unleash the power of large language models. Design, run, and analyze experiments with ease.
        </p>
        <p className="">Large Language Model [LLM] evaluation frameworks are an emerging space. 
            However we believe these frameworks are too complex or academic research focused for product teams exploring LLMs.</p>
        <p className="mt-5">Instead we offer a simple scoring system for evaluating LLMs.
            With our system you can load an LLM, prompt it, then score the LLM output.  
            We think of this as an experiment-based approach. Watch an experiment demo below.  
        </p>
        <p className="mt-5 mb-5">TODO: add demo video</p>
        <Button asChild className="text-lg px-8 py-6 rounded-md bg-white text-black-600 hover:bg-gray-100 animate-fade-in-up animation-delay-400">
          <Link href="https://www.lastmyle.co/connect">
            Send us Feedback
          </Link>
        </Button>
    </div>
  );
}
