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
} from "@/components/project_browser/dialog";
import { Input } from "@/components/commons/input";
import { Checkbox } from "@/components/project_browser/checkbox";
import { Idea } from "@/types/idea";
import { ApiService } from "@/api/apiService";
import { toast } from "sonner";
import { Sparkles, Wand2, Combine, FileText } from "lucide-react";
import { useAutoAnimate } from "@formkit/auto-animate/react";

interface AiDialogProps {
  ideas: Idea[];
  createIdea: (title: string, description: string) => Promise<Idea>;
  updateIdea: (
    ideaId: string,
    data: Partial<Idea>
  ) => Promise<Idea | undefined>;
}

export interface ApiResponse {
  id: string;
  type: string;
  role: string;
  content: Array<{
    type: string;
    text: string;
  }>;
  model: string;
  usage: {
    inputTokens: number;
    outputTokens: number;
  };
}

type AiAction = "refine" | "twist" | "combine" | "generate" | null;

export function AiDialog({
  ideas,
  createIdea,
  updateIdea,
}: AiDialogProps) {
  const [action, setAction] = useState<AiAction>(null);
  const [selectedIdeaIds, setSelectedIdeaIds] = useState<Set<string>>(
    new Set()
  );
  const [promptText, setPromptText] = useState("");
  const [parent] = useAutoAnimate();
  const apiService = useMemo(() => new ApiService(), []);

  const handleIdeaToggle = (id: string) =>
    setSelectedIdeaIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const handleExecute = async () => {
    if (!action) return;

 const extractAIContent = (response: ApiResponse): string => {
    if (
      response &&
      Array.isArray(response.content) &&
      response.content.length > 0 &&
      response.content[0].type === "text"
    ) {
      const lines = response.content[0].text
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l !== "");

      let startIndex = 1;
      if (lines.length > 1 && !lines[1].startsWith("•")) {
        startIndex = 2;
      }
      return lines.slice(startIndex).join("\n");
    }
    throw new Error("Invalid AI response format");
  };

    try {
      if (action === "refine") {
        const [ideaId] = Array.from(selectedIdeaIds);
        const idea = ideas.find((i) => i.ideaId === ideaId);
        if (!idea) throw new Error("Idea not found");

        const response = await apiService.refineIdea(idea.ideaDescription);
        const newBody = extractAIContent(response);
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
        const twistedBody = extractAIContent(response);
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
        const combinedBody = extractAIContent(response);
        await createIdea("Combined Idea", combinedBody);
        toast.success("Ideas combined successfully");

      } else if (action === "generate") {
        const response = await apiService.generateFromTemplate(promptText);
        const generatedBody = extractAIContent(response);
        await createIdea("Generated Idea", generatedBody);
        toast.success("Idea generated successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to execute AI action");
      return;
    }

    // Reset UI state
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

        <div className="grid grid-cols-2 gap-4">
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
            <div
              className="flex flex-col gap-2 max-h-60 overflow-y-auto"
              ref={parent}
            >
              {ideas.map((idea) => (
                <div
                  key={idea.ideaId}
                  onClick={() => handleIdeaToggle(idea.ideaId)}
                  className="flex items-center justify-between px-3 py-2 border rounded hover:bg-muted cursor-pointer"
                >
                  <span className="truncate">{idea.ideaName}</span>
                  <Checkbox checked={selectedIdeaIds.has(idea.ideaId)} />
                </div>
              ))}
            </div>
          </div>
        )}

        {(action === "twist" || action === "generate") && (
          <div className="flex flex-col mt-4 space-y-2">
            <h4 className="text-sm font-semibold">
              {action === "twist"
                ? "Enter twist description:"
                : "Enter template or topic:"}
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
          <Button disabled={!validSelection} onClick={handleExecute}>
            Execute
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
