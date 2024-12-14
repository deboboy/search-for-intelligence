'use client'

import { ExperimentSetupAdvanced } from "@/components/experiment-setup-advanced";

function ExperimentSetupAdvancedStepOne() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-5xl md:text-7xl font-extrabold mb-5 animate-fade-in-up">
        Advanced Experiment Setup
      </h1>
      <ExperimentSetupAdvanced />
    </div>
  );
}

export default ExperimentSetupAdvancedStepOne;