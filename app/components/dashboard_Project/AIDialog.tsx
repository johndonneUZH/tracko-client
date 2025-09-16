/*eslint-disable @typescript-eslint/no-unused-expressions*/

"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/commons/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/commons/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Idea } from "@/types/idea";
import { ApiService } from "@/api/apiService";
import { toast } from "sonner";
import { Sparkles, Wand2, Combine, FileText } from "lucide-react";
import { useAutoAnimate } from "@formkit/auto-animate/react";

interface AiDialogProps {
  ideas: Idea[];
  createIdea: (title: string, description: string) => Promise<Idea>;
  updateIdea: (ideaId: string, data: Partial<Idea>) => Promise<Idea | undefined>;
}

// AI endpoints now return simple strings

type AiAction = "refine" | "twist" | "combine" | "generate" | null;

export function AiDialog({ ideas, createIdea, updateIdea }: AiDialogProps) {
  const [action, setAction] = useState<AiAction>(null);
  const [selectedIdeaIds, setSelectedIdeaIds] = useState<Set<string>>(new Set());
  const [promptText, setPromptText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [parent] = useAutoAnimate();
  const apiService = useMemo(() => new ApiService(), []);

  const handleIdeaToggle = (id: string) => {
    setSelectedIdeaIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const extractAIContent = (response: string): string => {
    if (!response || typeof response !== 'string') {
      throw new Error("Invalid AI response format - expected string");
    }

    const lines = response
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .filter(line => !line.startsWith('#'));

    if (lines.some(line => line.startsWith('•') || line.startsWith('-'))) {
      return lines.join('\n');
    }

    return lines.join('\n');
  };

  const extractGeneratedContent = (response: string): { title: string; description: string } => {
    if (!response || typeof response !== 'string') {
      throw new Error("Invalid AI response format - expected string");
    }

    const lines = response
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    let title = '';
    let description = '';
    let descriptionStartIndex = 0;

    const titleLine = lines.find(line => line.startsWith('Title:'));
    if (titleLine) {
      title = titleLine.replace('Title:', '').trim();
      descriptionStartIndex = lines.indexOf(titleLine) + 1;
    } else {
      title = lines[0] || 'Untitled Idea';
      descriptionStartIndex = 1;
    }

    description = lines
      .slice(descriptionStartIndex)
      .join('\n')
      .replace(/Description:/, '')
      .trim();

    return { title, description };
  };

  const handleExecute = async () => {
    setIsLoading(true);
    if (!action) return;

    try {
      if (action === "refine") {
        const [ideaId] = Array.from(selectedIdeaIds);
        const idea = ideas.find((i) => i.ideaId === ideaId);
        if (!idea) throw new Error("Idea not found");
        
        const response = await apiService.refineIdea(
          `Title: ${idea.ideaName}\nDescription: ${idea.ideaDescription}`
        );
        const newBody = extractAIContent(response as string);
        await updateIdea(ideaId, { ideaDescription: newBody });
        toast.success("Idea refined successfully");

      } else if (action === "twist") {
        const [ideaId] = Array.from(selectedIdeaIds);
        const idea = ideas.find((i) => i.ideaId === ideaId);
        if (!idea) throw new Error("Idea not found");

        const response = await apiService.suggestWithTwist(
          idea.ideaDescription,
          promptText
        );
        const twistedBody = extractAIContent(response as string);
        await updateIdea(ideaId, { ideaDescription: twistedBody });
        toast.success("Idea twisted successfully");

      } else if (action === "combine") {
        const [id1, id2] = Array.from(selectedIdeaIds);
        const ideaOne = ideas.find((i) => i.ideaId === id1);
        const ideaTwo = ideas.find((i) => i.ideaId === id2);
        if (!ideaOne || !ideaTwo) throw new Error("Ideas not found");

        const response = await apiService.combineIdeas(
          ideaOne.ideaDescription,
          ideaTwo.ideaDescription
        );
        const combinedBody = extractAIContent(response as string);
        await createIdea(
          `${ideaOne.ideaName} + ${ideaTwo.ideaName}`,
          combinedBody
        );
        toast.success("Ideas combined successfully");

      } else if (action === "generate") {
        const response = await apiService.generateFromTemplate(promptText);
        const { title, description } = extractGeneratedContent(response as string);
        await createIdea(title, description);
        toast.success("Idea generated successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to execute AI action");
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
    setAction(null);
    setSelectedIdeaIds(new Set());
    setPromptText("");
  };

  const validSelection =
    (action === "refine" && selectedIdeaIds.size === 1) ||
    (action === "twist" && selectedIdeaIds.size === 1 && promptText.trim() !== "") ||
    (action === "combine" && selectedIdeaIds.size === 2) ||
    (action === "generate" && promptText.trim() !== "");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="py-2 px-4 flex gap-2">
          <Sparkles className="w-5 h-5" />
          AI
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Use AI to improve your ideas</DialogTitle>
          <DialogDescription>
            Select an action and ideas to modify or create.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 w-full mt-4">
          <Button
            variant={action === "refine" ? "default" : "outline"}
            onClick={() => setAction("refine")}
          >
            <Wand2 className="w-4 h-4 mr-2" />
            Refine
          </Button>
          <Button
            variant={action === "twist" ? "default" : "outline"}
            onClick={() => setAction("twist")}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Twist
          </Button>
          <Button
            variant={action === "combine" ? "default" : "outline"}
            onClick={() => setAction("combine")}
          >
            <Combine className="w-4 h-4 mr-2" />
            Combine
          </Button>
          <Button
            variant={action === "generate" ? "default" : "outline"}
            onClick={() => setAction("generate")}
          >
            <FileText className="w-4 h-4 mr-2" />
            Generate
          </Button>
        </div>

        {(action === "refine" || action === "twist" || action === "combine") && (
          <div className="space-y-2 mt-4">
            <h4 className="text-sm font-semibold">Select idea(s):</h4>
            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto" ref={parent}>
              {ideas.map((idea) => (
                <div
                  key={`${idea.ideaId}-${idea.ideaName}`} // Unique key combining ID and name
                  onClick={() => handleIdeaToggle(idea.ideaId)}
                  className="flex items-center justify-between px-3 py-2 border rounded hover:bg-muted cursor-pointer"
                >
                  <span className="truncate max-w-[220px]">{idea.ideaName}</span>
                  <Checkbox checked={selectedIdeaIds.has(idea.ideaId)} />
                </div>
              ))}
            </div>
          </div>
        )}

        {(action === "twist" || action === "generate") && (
          <div className="flex flex-col mt-4 space-y-2">
            <h4 className="text-sm font-semibold">
              {action === "twist" ? "Enter twist description:" : "Enter template or topic:"}
            </h4>
            <Input
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder={
                action === "twist" 
                  ? "Make it suitable for kids..." 
                  : "Ideas for remote work..."
              }
            />
          </div>
        )}

        <DialogFooter className="pt-4">
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button disabled={!validSelection || isLoading} onClick={handleExecute}>
            {isLoading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Generating...
              </span>
            ) : (
              <span className="flex items-center">
                <Sparkles className="mr-2 h-4 w-4" />
                Execute
              </span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
