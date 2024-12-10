'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function ExperimentResultsAdvanced() {
  // This would typically come from a state management solution or props
  const scores = {
    llmA: { accuracy: 4, relevancy: 5, quality: 3, factuality: 4 },
    llmB: { accuracy: 3, relevancy: 4, quality: 5, factuality: 3 }
  }

  const categories = ['Accuracy', 'Relevancy', 'Quality', 'Factuality']

  const calculateAverage = (scores: Record<string, number>) => {
    const total = Object.values(scores).reduce((sum, score) => sum + score, 0)
    return (total / Object.keys(scores).length).toFixed(2)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center text-sm text-muted-foreground mt-4">
          <span className="font-medium text-muted-foreground">Step 1</span>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="font-medium text-muted-foreground">Step 2</span>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="font-medium text-muted-foreground">Step 3</span>
          <ChevronRight className="w-4 h-4 mx-2"/>
          <span className="text-primary">Step 4</span>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-bold">Advanced Experiment Results</CardTitle>
            <p className="text-sm text-muted-foreground">Review and compare scores from each LLM</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Category</TableHead>
              <TableHead>LLM A Score</TableHead>
              <TableHead>LLM B Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category}>
                <TableCell className="font-medium">{category}</TableCell>
                <TableCell>{scores.llmA[category.toLowerCase() as keyof typeof scores.llmA]}</TableCell>
                <TableCell>{scores.llmB[category.toLowerCase() as keyof typeof scores.llmB]}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell className="font-medium">Average</TableCell>
              <TableCell className="font-bold">{calculateAverage(scores.llmA)}</TableCell>
              <TableCell className="font-bold">{calculateAverage(scores.llmB)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <div className="flex justify-between mt-8">
          <Link href="/advanced-scoring" passHref>
            <Button variant="outline">Previous</Button>
          </Link>
          <Button>Finish Experiment</Button>
        </div>
      </CardContent>
    </Card>
  )
}