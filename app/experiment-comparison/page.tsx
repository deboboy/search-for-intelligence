import ExperimentComparisonChart from '../components/ComparisonTableChart';

export default function ExperimentComparison() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-5xl md:text-7xl font-extrabold mb-5 animate-fade-in-up">
        Experiment Comparison
      </h1>
      <p className="mb-5">Compare scores for two experiments, TODO: add more explantory copy...</p>
      <ExperimentComparisonChart />
    </div>
  );
}
