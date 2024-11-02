import { ChatInterface } from '../components/ChatInterface';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import PromptList from '../components/PromptList';
import ChatList from '../components/ChatList';

export default function ExperimentRun() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Experiment Run</h1>
      <Sheet>
        <SheetTrigger>Settings</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Experiment Settings</SheetTitle>
            <SheetDescription>
              User input from step one, then from model prompts. All content is volitile with IndexedDB storage.
            </SheetDescription>
            <p>Model</p>
            <p>Description</p>
            <ChatList />
          </SheetHeader>
        </SheetContent>
      </Sheet>
      <ChatInterface />
    </div>
  );
}
