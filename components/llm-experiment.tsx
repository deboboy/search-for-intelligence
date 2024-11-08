'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { db2 } from '@/app/lib/db2'  // Adjust the import path as necessary

// Define an interface for the LLM options
interface LlmOption {
  value: string;
  label: string;
  apiRoute: string;
}

// Define the LLM options
const llmOptions: LlmOption[] = [
  { value: "zephyr-7b-beta", label: "zephyr-7b-beta", apiRoute: "/api/huggingface" },
  { value: "qwen-2.5-7b-instruct", label: "qwen-2.5-7b-instruct", apiRoute: "/api/openrouter" },
  { value: "stability-ai-sdxl", label: "stability-ai-sdxl", apiRoute: "/api/stability" },
  { value: "obsidian-3B-V0.5", label: "obsidian-3B-V0.5", apiRoute: "/api/obsidian" },
];

export function LlmExperiment() {
  const [selectedLLM, setSelectedLLM] = useState<LlmOption | null>(null)
  const [experimentDescription, setExperimentDescription] = useState<string>('')
  const router = useRouter()

  const handleStartExperiment = async () => {
    try {
      // Create a new experiment object
      const newExperiment = {
        llm: selectedLLM?.value ?? '',
        description: experimentDescription,
        timestamp: new Date().toISOString()
      }

      // Add the experiment to the database
      const experimentId = await db2.addExperiment(newExperiment)

      console.log('Experiment added with ID:', experimentId)

      // Navigate to the experiment run page with the selected LLM and correct API route
      if (selectedLLM) {
        router.push(`/experiment-run?id=${experimentId}&llm=${selectedLLM.value}&apiRoute=${selectedLLM.apiRoute}`)
      } else {
        console.error('No LLM selected')
      }
    } catch (error) {
      console.error('Error starting experiment:', error)
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
          <Select onValueChange={(value) => {
            const option = llmOptions.find(opt => opt.value === value);
            setSelectedLLM(option || null);
          }}>
            <SelectTrigger id="llm-select">
              <SelectValue placeholder="Choose from built-in models" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="zephyr-7b-beta">zephyr-7b-beta</SelectItem>
              <SelectItem value="qwen-2.5-7b-instruct">qwen-2.5-7b-instruct</SelectItem>
              <SelectItem value="stability-ai-sdxl">stability-ai-sdxl</SelectItem>
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