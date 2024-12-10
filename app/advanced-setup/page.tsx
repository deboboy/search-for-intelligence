'use client'

import { withAuth } from '../components/withAuth'
import { ExperimentSetupAdvanced } from "@/components/experiment-setup-advanced";

function ExperimentSetupAdvancedStepOne() {
  return (
    <div className="container mx-auto px-4 py-8">
      <ExperimentSetupAdvanced />
    </div>
  );
}

export default withAuth(ExperimentSetupAdvancedStepOne);