import { LlmExperiment } from "@/components/llm-experiment";

export default function ExperimentSetup() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-5xl md:text-7xl font-extrabold mb-5 animate-fade-in-up">
        Basic Experiment Setup
      </h1>
      <p className="mb-5">Load an LLM, prompt it, then score the LLM output to run an experiment.  Fill out the form to get started.</p>
      <LlmExperiment />
    </div>
  );
}
