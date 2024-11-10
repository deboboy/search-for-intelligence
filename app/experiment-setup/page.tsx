import { LlmExperiment } from "@/components/llm-experiment";

export default function ExperimentSetup() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Experiment Setup</h1>
      <p>Select an LLM, then describe the experiment to run.</p>
      <LlmExperiment />
    </div>
  );
}
