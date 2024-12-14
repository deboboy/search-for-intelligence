'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { ChevronRight } from 'lucide-react'

export function ExperimentSetupAdvanced() {

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center text-sm text-muted-foreground mt-4">
          <span className="font-bold text-primary">Step 1</span>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-muted-foreground">Step 2</span>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-muted-foreground">Step 3</span>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">Select a pair of LLMs, add a prompt, then score their output.  Fill out the form to get started.</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold border-b pb-2">Describe the experiment</h2>
          <Textarea
            className="mt-2"
            placeholder="Enter the experiment description, for example testing function calling support..."
            rows={3}
          />
        </div>
        
        <div>
          <h2 className="text-lg font-semibold border-b pb-2">Select LLM pairs</h2>
          <RadioGroup defaultValue="text-gen" className="mt-2 space-y-3">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="text-gen" id="text-gen" />
              <Label htmlFor="text-gen">text gen - text gen</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="text-to-image" id="text-to-image" />
              <Label htmlFor="text-to-image">text to image - text to image</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <h2 className="text-lg font-semibold border-b pb-2">Add a prompt</h2>
          <Textarea
            className="mt-2"
            placeholder="Enter a prompt to run against the LLM pair..."
            rows={3}
          />
        </div>

        <Link href="/advanced-run" passHref>
          <Button className="w-full mt-8">NEXT</Button>
        </Link>
      </CardContent>
    </Card>
  )
}