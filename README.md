## Search for Intelligence
A new beginning for this AI experiments concept. This version will be focused on LLM evaluation workflow; and feature scoring and storing of results.  

# TODOS
[x] Borrow chat streaming response pattern from the original SFI; add to ChatInterface.tsx
[x] Modify routes so the finish page is Experiment Intro after the homepage image dissolves 
[X] Modify routes so the finish page is Experiment Run after clicking SUBMIT on the Experiment Intro form
[X] Modify Experiment Run layout where Scoring component is to the left of the ChatInterface component
[x] Add a shadcn UI navbar present on all pages
[x] Add a shadcn UI breadcrumb component to display current step in the workflow
[ ] Create a new page; Experiment Results; which will display model, chat input, LLM response, scores
[ ] Link to Experiment Results from the Screen component, from the summary card for an experiment
[X] Rename the Settings link in Experiment Run to Summary
[ ] Add a version number to the Summary card; or borrow the ID number; to display different versions of experiments
[x] Add Experiment Intro PromptForm metadata to Experiment Summary card
[ ] Fix LLM response added to IndexedDB ChatDatabase; Cursor + Claude 3.5 Sonnet suggests the following:  
However, there's an issue with the AI's response. The content field only contains 'I', which is not a complete response. This suggests that the AI's response might be getting cut off or not fully captured.
Let's modify the code to ensure we're capturing the full AI response. Update your useEffect hook in ChatInterface.tsx as follows:  
```
useEffect(() => {
    console.log('Messages updated:', messages);
    if (shouldAddToDb && messages.length >= 2) {
        const userMessage = messages[messages.length - 2];
        const aiMessage = messages[messages.length - 1];
        if (userMessage.role === 'user' && aiMessage.role === 'assistant') {
            const newChat = {
                input: userMessage.content,
                content: aiMessage.content,
                llm: ['HuggingFace'],
                timestamp: new Date().toISOString()
            };
            console.log('Attempting to add chat:', newChat);
            db2.addChat(newChat)
                .then(() => console.log('Chat added successfully'))
                .catch((error) => console.error('Error adding chat to database:', error));
            setShouldAddToDb(false);
        } else {
            console.log('Unexpected message roles:', userMessage.role, aiMessage.role);
        }
    }
}, [messages, shouldAddToDb]);
```  
This update includes additional logging to help us understand what's happening with the messages.
Also, let's modify the handleSubmit function in the useChat hook to ensure we're getting the full response:  
```
const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/huggingface',
    onResponse: (response) => {
        console.log('Full API response:', response);
    },
    onFinish: (message) => {
        console.log('Finished message:', message);
        setShouldAddToDb(true);
    },
    onError: (error) => {
        console.error('Chat error:', error);
        setError('An error occurred while sending the message. Please try again.');
    },
});
```


[x] Add Experiment scoring component from Claude.ai; https://claude.ai/chat/0109d7b7-e9db-4908-8525-135d09c5ff60
[ ] Store Experiment Setup Settings in a new IndexedDB table
[ ] Display Experiment Setup Settings in shadcn Sheets component


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

