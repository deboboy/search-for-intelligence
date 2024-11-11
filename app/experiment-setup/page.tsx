import { LlmExperiment } from "@/components/llm-experiment";

export default function ExperimentSetup() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-5xl md:text-7xl font-extrabold mb-5 animate-fade-in-up">
        Experiment Setup
      </h1>
      <p>Fill out the form to setup an experiment.</p>
      <LlmExperiment />
    </div>
  );
}
