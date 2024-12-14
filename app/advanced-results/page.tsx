'use client'

import { ExperimentResultsAdvanced } from "@/components/experiment-results-advanced";

function ExperimentScoringAdvancedStepFour() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-5xl md:text-7xl font-extrabold mb-5 animate-fade-in-up">
        Advanced Experiment Results
      </h1>
      <ExperimentResultsAdvanced /> 
    </div>
  );
}

export default ExperimentScoringAdvancedStepFour;