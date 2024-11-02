// app/page.tsx

'use client';

import PromptForm from './components/PromptForm';
import PromptList from './components/PromptList';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"


export default function ExperimentNotes() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Search for Intelligence: Eval Console</h1>
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Are you absolutely sure?</SheetTitle>
            <SheetDescription>
              This action cannot be undone. This will permanently delete your account
              and remove your data from our servers.
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
      <PromptForm onPromptAdded={() => {
        // Force a re-render of PromptList
        const event = new Event('promptAdded');
        window.dispatchEvent(event);
      }} />
      <PromptList />
    </main>
  );
}