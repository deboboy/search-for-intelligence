'use client'

import { ExperimentRunAdvanced } from "@/components/experiment-run-advanced";

function ExperimentRunAdvancedStepTwo() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-5xl md:text-7xl font-extrabold mb-5 animate-fade-in-up">
        Advanced Experiment Run
      </h1>
      <ExperimentRunAdvanced />
    </div>
  );
}

export default ExperimentRunAdvancedStepTwo;
