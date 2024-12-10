'use client'

import { withAuth } from '../components/withAuth'
import { ExperimentResultsAdvanced } from "@/components/experiment-results-advanced";

function ExperimentScoringAdvancedStepFour() {
  return (
    <div className="container mx-auto px-4 py-8">
      <ExperimentResultsAdvanced /> 
    </div>
  );
}

export default withAuth(ExperimentScoringAdvancedStepFour)