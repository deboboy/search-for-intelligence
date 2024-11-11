'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { db2 } from '@/app/lib/db2'  // Adjust the import path as necessary

// Define an interface for the LLM options
interface LlmOption {
  value: string;
  label: string;
  apiRoute: string;
  isImageModel: boolean;
}

// Define the LLM options
const llmOptions: LlmOption[] = [
  { value: "zephyr-7b-beta", label: "zephyr-7b-beta", apiRoute: "/api/huggingface", isImageModel: false },
  { value: "qwen-2.5-7b-instruct", label: "qwen-2.5-7b-instruct", apiRoute: "/api/openrouter", isImageModel: false },
  { value: "stability-ai/sdxl", label: "stability-ai/sdxl", apiRoute: "/api/replicate", isImageModel: true },
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
        // In the handleStartExperiment function, update the router.push call
        router.push(`/experiment-run?id=${experimentId}&llm=${selectedLLM.value}&apiRoute=${selectedLLM.apiRoute}&isImageModel=${selectedLLM.isImageModel}`)
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
        <CardDescription>Describe your experiment in detail; which is used for comparison in the results step.
          Then select an LLM to run the experiment with. 
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="experiment-description" className="text-sm font-medium">
            Describe Experiment
          </label>
          <Textarea
            id="experiment-description"
            placeholder="For example: evaluate text generation quality for software architecture; or relevancy for image generation"
            value={experimentDescription}
            onChange={(e) => setExperimentDescription(e.target.value)}
            rows={4}
          />
        </div>
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
              <SelectItem value="stability-ai/sdxl">stability-ai/sdxl</SelectItem>
            </SelectContent>
          </Select>
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