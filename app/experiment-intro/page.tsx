import { LlmExperiment } from "../../components/llm-experiment";

export default function EvalIntroPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Setup an Experiment</h1>
      <LlmExperiment />
    </div>
  );
}
