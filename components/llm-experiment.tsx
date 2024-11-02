'use client'

import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"

export function LlmExperiment() {
  const [selectedLLM, setSelectedLLM] = useState<string>('')
  const [experimentDescription, setExperimentDescription] = useState<string>('')

  const handleStartExperiment = () => {
    console.log('Starting experiment with:', { selectedLLM, experimentDescription })
    // Here you would typically send this data to your backend or perform other actions
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>Select an LLM then describe your experiment</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="llm-select" className="text-sm font-medium">
            Select LLM
          </label>
          <Select onValueChange={setSelectedLLM}>
            <SelectTrigger id="llm-select">
              <SelectValue placeholder="Choose from built-in models" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-3.5-turbo">zephyr-7b-beta</SelectItem>
              <SelectItem value="gpt-4">stability-ai-sdxl</SelectItem>
              <SelectItem value="claude-v1">bart-large-cnn</SelectItem>
              <SelectItem value="llama-2">obsidian-3B-V0.5</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label htmlFor="experiment-description" className="text-sm font-medium">
            Describe Experiment
          </label>
          <Textarea
            id="experiment-description"
            placeholder="Describe your experiment here..."
            value={experimentDescription}
            onChange={(e) => setExperimentDescription(e.target.value)}
            rows={4}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleStartExperiment}
          disabled={!selectedLLM || !experimentDescription}
          className="w-full"
        >
          Start Experiment
        </Button>
      </CardFooter>
    </Card>
  )
}