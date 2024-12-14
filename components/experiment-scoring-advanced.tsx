'use client'

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function ExperimentScoringAdvanced() {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center text-sm text-muted-foreground mt-4">
          <span className="font-medium text-muted-foreground">Step 1</span>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="font-medium text-muted-foreground">Step 2</span>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="font-bold text-primary">Step 3</span>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">Score the output from each LLM</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LLM A Scoring */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold border-b pb-2">LLM A Score</h2>
            {["Accuracy", "Relevancy", "Quality", "Factuality"].map((category) => (
              <div key={category} className="space-y-2">
                <Label className="text-sm font-medium">{category}</Label>
                <RadioGroup defaultValue="0" className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <div key={value} className="flex items-center space-x-1">
                      <RadioGroupItem
                        value={value.toString()}
                        id={`llma-${category.toLowerCase()}-${value}`}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={`llma-${category.toLowerCase()}-${value}`}
                        className="h-8 w-8 rounded-full border-2 flex items-center justify-center cursor-pointer peer-checked:bg-primary peer-checked:text-primary-foreground peer-checked:border-primary hover:border-primary transition-colors"
                      >
                        {value}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}
          </div>

          {/* LLM B Scoring */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold border-b pb-2">LLM B Score</h2>
            {["Accuracy", "Relevancy", "Quality", "Factuality"].map((category) => (
              <div key={category} className="space-y-2">
                <Label className="text-sm font-medium">{category}</Label>
                <RadioGroup defaultValue="0" className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <div key={value} className="flex items-center space-x-1">
                      <RadioGroupItem
                        value={value.toString()}
                        id={`llmb-${category.toLowerCase()}-${value}`}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={`llmb-${category.toLowerCase()}-${value}`}
                        className="h-8 w-8 rounded-full border-2 flex items-center justify-center cursor-pointer peer-checked:bg-primary peer-checked:text-primary-foreground peer-checked:border-primary hover:border-primary transition-colors"
                      >
                        {value}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-between mt-8">
          <Link href="/advanced-run" passHref>
            <Button variant="outline">Previous</Button>
          </Link>
          <Link href="/advanced-results" passHref>
            <Button>Next</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}