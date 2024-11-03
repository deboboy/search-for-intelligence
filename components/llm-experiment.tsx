'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { db2 } from '@/app/lib/db2'  // Adjust the import path as necessary

export function LlmExperiment() {
  const [selectedLLM, setSelectedLLM] = useState<string>('')
  const [experimentDescription, setExperimentDescription] = useState<string>('')
  const router = useRouter()

  const handleStartExperiment = async () => {
    try {
      // Create a new experiment object
      const newExperiment = {
        llm: selectedLLM,
        description: experimentDescription,
        timestamp: new Date().toISOString()
      }

      // Add the experiment to the database
      const experimentId = await db2.addExperiment(newExperiment)

      console.log('Experiment added with ID:', experimentId)

      // Navigate to the experiment run page
      router.push(`/experiment-run?id=${experimentId}`)
    } catch (error) {
      console.error('Error starting experiment:', error)
      // Handle the error (e.g., show an error message to the user)
    }
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
              <SelectItem value="zephyr-7b-beta">zephyr-7b-beta</SelectItem>
              <SelectItem value="stability-ai-sdxl">stability-ai-sdxl</SelectItem>
              <SelectItem value="bart-large-cnn">bart-large-cnn</SelectItem>
              <SelectItem value="obsidian-3B-V0.5">obsidian-3B-V0.5</SelectItem>
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
          Run Experiment
        </Button>
      </CardFooter>
    </Card>
  )
}