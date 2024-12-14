'use client'

import { ExperimentScoringAdvanced } from "@/components/experiment-scoring-advanced";

function ExperimentScoringAdvancedStepThree() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-5xl md:text-7xl font-extrabold mb-5 animate-fade-in-up">
        Advanced Experiment Scoring
      </h1>
      <ExperimentScoringAdvanced />
    </div>
  );
}

export default ExperimentScoringAdvancedStepThree;
