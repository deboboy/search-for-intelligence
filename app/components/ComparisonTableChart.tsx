'use client';

import { db, Chat } from '../lib/db';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

type ExperimentData = {
    id: number;
    timestamp: number;
    [key: string]: number;
};

const ExperimentComparisonChart = () => {
    const [chats, setChats] = useState<Chat[]>([]);
    const [selectedExperiments, setSelectedExperiments] = useState<number[]>([]);
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'chart'

    const metrics = ['accuracy', 'relevancy', 'quality', 'factuality'];
    const llms = Array.from(new Set(chats.flatMap(chat => chat.llm)));
    const colors = ['#2563eb', '#dc2626', '#16a34a', '#9333ea'];

    const experiments: ExperimentData[] = Array.from(new Set(chats.map(chat => chat.experimentId)))
    .map(id => ({
        id,
        timestamp: Number(chats.find(chat => chat.experimentId === id)?.timestamp || 0),
        ...metrics.reduce((acc, metric) => ({
            ...acc,
            [metric]: chats.find(chat => chat.experimentId === id)?.scores?.[metric as keyof Chat['scores']] || 0
        }), {})
    }));

    useEffect(() => {
        const fetchChats = async () => {
          const allChats = await db.getAllChats();
          setChats(allChats);
        };
        fetchChats();
      }, []);

  const formatTimestamp = (timestamp: number | string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getChartData = () => {
    return metrics.map(metric => ({
      name: metric.charAt(0).toUpperCase() + metric.slice(1),
      ...experiments
        .filter(exp => selectedExperiments.includes(exp.id))
        .reduce((acc, exp) => ({
          ...acc,
          [`Exp ${exp.id}`]: exp[metric]
        }), {})
    }));
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl">Comparison</CardTitle>
        <Button
          variant="outline"
          onClick={() => setViewMode(prev => prev === 'table' ? 'chart' : 'table')}
          className="flex items-center gap-2"
        >
          {viewMode === 'table' ? 'Show Chart' : 'Show Table'}
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {viewMode === 'table' ? (
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr>
                    <th className="px-6 py-3 text-left">Metric</th>
                    {llms.map(llm => (
                        <th key={llm} className="px-6 py-3 text-center">{llm}</th>
                    ))}
                    {selectedExperiments.map(expId => (
                        <th key={expId} className="px-6 py-3 text-center">
                        Experiment {expId}
                        </th>
                    ))}
                    <th className="px-6 py-3 text-center">Diff</th>
                    </tr>
                </thead>
                <tbody>
                    {metrics.map(metric => (
                    <tr key={metric}>
                        <td className="px-6 py-4 font-medium capitalize">{metric}</td>
                        {llms.map(llm => (
                        <td key={llm} className="px-6 py-4 text-center">
                        {chats
                          .filter(chat => selectedExperiments.includes(chat.experimentId) && chat.llm.includes(llm))
                          .map(chat => (
                            <span key={chat.id} className="px-2 py-1 rounded">
                              {(chat.scores?.[metric as keyof Chat['scores']] as number | undefined)?.toFixed(3) || 'N/A'}
                            </span>
                          ))}
                      </td>
                        ))}
                        {/* Add cells for selected experiments and diff calculation */}
                    </tr>
                    ))}
                </tbody>
            </table>
          </div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 1]} />
                <Tooltip />
                <Legend />
                {experiments
                  .filter(exp => selectedExperiments.includes(exp.id))
                  .map((exp, index) => (
                    <Line
                      key={exp.id}
                      type="monotone"
                      dataKey={`Exp ${exp.id}`}
                      stroke={colors[index]}
                      strokeWidth={2}
                    />
                  ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="flex gap-4 flex-wrap">
          {experiments.map(exp => (
            <Button
              key={exp.id}
              variant={selectedExperiments.includes(exp.id) ? "default" : "outline"}
              onClick={() => {
                setSelectedExperiments(prev => {
                  if (prev.includes(exp.id)) {
                    return prev.filter(id => id !== exp.id);
                  }
                  if (prev.length < 2) {
                    return [...prev, exp.id];
                  }
                  return [prev[1], exp.id];
                });
              }}
              className="text-sm"
            >
              Exp {exp.id} - {formatTimestamp(exp.timestamp)}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExperimentComparisonChart;