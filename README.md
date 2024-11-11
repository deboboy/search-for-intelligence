## Search for Intelligence
A new beginning for this AI experiments concept. This version will be focused on LLM evaluation workflow; and feature scoring and storing of results.  

# ROADMAP  
[ ] Add from Evernote




# TODOS
[x] Add shadcn ui sort component to /experiment-results page
[ ] Add shadcn ui compare component to /experiment-results page; to select two experiments for comparison; see what v0 generated here: npx shadcn@latest add "https://v0.dev/chat/b/b_19FJyS4Oa8Q?token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..SsqUYHM75vmXAS42.TtFDAElwsIM1gQJPQsUUA8JTBjRCPJT03yS0kTxO32trAc6HuCGFljSH5Kw.I4JlyAl9kYb6u-8MM-WN2Q"
[ ] To add the v0 comparison sub-system: npx shadcn@latest add "https://v0.dev/chat/b/b_19FJyS4Oa8Q?token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..SsqUYHM75vmXAS42.TtFDAElwsIM1gQJPQsUUA8JTBjRCPJT03yS0kTxO32trAc6HuCGFljSH5Kw.I4JlyAl9kYb6u-8MM-WN2Q"
[ ] Think about whether the comparison sub-system is on displayed on /experiment-results or a page below that route; something like /experiment-results/comparison 
[ ] Also think about how to architect the comparison sub-system to compare two different LLMs for the same input; and possibly integrate this in the /experiments-setup form
[ ] Fix architecture so that generated image is loaded in the Experiment Summary sheet component; and in the Experiments Results page
[ ] Add CSV download to /experiment-results page
[x] Fix architecture so that selecting Replicate model switches to ImageInterface in ExperimentRun; not ChatInterface; because the Replicate model is an image LLM response 
[x] Fix prompt required error; OpenRouter API
[x] Fix this error in the AWS environment; Error: OpenRouter API key not configured
[x] Borrow chat streaming response pattern from the original SFI; add to ChatInterface.tsx
[x] Modify routes so the finish page is Experiment Intro after the homepage image dissolves 
[X] Modify routes so the finish page is Experiment Run after clicking SUBMIT on the Experiment Intro form
[X] Modify Experiment Run layout where Scoring component is to the left of the ChatInterface component
[x] Add a shadcn UI navbar present on all pages
[x] Add a shadcn UI breadcrumb component to display current step in the workflow
[x] Create a new page; Experiment Results; which will display model, chat input, LLM response, scores
[x] Link to Experiment Results from the Screen component, from the summary card for an experiment
[X] Rename the Settings link in Experiment Run to Summary
[x] Add a version number to the Summary card; or borrow the ID number; to display different versions of experiments
[x] Add Experiment Intro PromptForm metadata to Experiment Summary card
[ ] Add another LLM endpoint; like Qwen 2.5; to test the modularity of the chat experiments workflow
[x] Add Settings page
[ ] Add configuration panels on the Settings page; for users to add their API endpoints
[ ] Add paywall for Settings page
[ ] Add account system connected to paid status
[ ] Then add a modular LLM endpoint system for users to add their own endpoint
[x] Fix LLM response added to IndexedDB ChatDatabase
[x] Add Experiment scoring component from Claude.ai; https://claude.ai/chat/0109d7b7-e9db-4908-8525-135d09c5ff60
[x] Store Experiment Setup Settings in a new IndexedDB table
[x] Display Experiment Setup Settings in shadcn Sheets component


## Stack
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

# Frontend
One component generated with v0; added via:  
npx shadcn@latest add "https://v0.dev/chat/b/b_TjhSK7uTda9?token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..r2KrLppGe3u71jwO.Ddq9115ba2zJVKxwpEPlRERcO7dWowYx-Rm7I0t0km-o4FAU4J-PdOqS_cI.wI4X99etPz93-OlzgN3VsA"


Another component generated with Claude.ai:  
https://claude.ai/chat/e1823f29-c56b-4ff6-964a-c3915caddf58


While other components generated with Cursor + Claude 3.5 Sonnet

