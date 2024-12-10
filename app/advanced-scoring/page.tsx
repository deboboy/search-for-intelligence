'use client'

import { withAuth } from '../components/withAuth'
import { ExperimentScoringAdvanced } from "@/components/experiment-scoring-advanced";

function ExperimentScoringAdvancedStepThree() {
  return (
    <div className="container mx-auto px-4 py-8">
      <ExperimentScoringAdvanced />
    </div>
  );
}

export default withAuth(ExperimentScoringAdvancedStepThree)
