'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ChevronRight } from 'lucide-react'

export function ExperimentRunAdvanced() {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center text-sm text-muted-foreground mt-4">
          <span className="font-medium text-muted-foreground">Step 1</span>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="font-medium text-primary">Step 2</span>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-muted-foreground">Step 3</span>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-bold">Advanced Experiment Run</CardTitle>
            <p className="text-sm text-muted-foreground">Review output from each LLM in the pair.</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LLM A Column */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold border-b pb-2">LLM A output</h2>
            <div className="min-h-[200px] p-4 bg-muted rounded-lg">
              <p className="text-muted-foreground italic">Output will appear here...</p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">prompt</h3>
              <Textarea 
                placeholder="Enter new prompt for LLM A..."
                className="resize-none"
                rows={3}
              />
            </div>
          </div>

          {/* LLM B Column */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold border-b pb-2">LLM B output</h2>
            <div className="min-h-[200px] p-4 bg-muted rounded-lg">
              <p className="text-muted-foreground italic">Output will appear here...</p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">prompt</h3>
              <Textarea 
                placeholder="Enter new prompt for LLM B..."
                className="resize-none"
                rows={3}
              />
            </div>
          </div>
        </div>
        <Link href="/advanced-scoring" passHref>
          <Button className="w-full mt-8">NEXT</Button>
        </Link>
      </CardContent>
    </Card>
  )
}