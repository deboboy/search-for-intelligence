'use client'

import { withAuth } from '../components/withAuth'
import { ExperimentRunAdvanced } from "@/components/experiment-run-advanced";

function ExperimentRunAdvancedStepTwo() {
  return (
    <div className="container mx-auto px-4 py-8">
      <ExperimentRunAdvanced />
    </div>
  );
}

export default withAuth(ExperimentRunAdvancedStepTwo)
