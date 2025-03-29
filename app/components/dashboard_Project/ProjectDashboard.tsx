"use client";

import { useEffect } from "react";
import { Idea } from "./IdeaModal";
import IdeaBox from "./IdeaBox"; 
import { useCurrentUserId } from "@/lib/dashboard_utils/useCurrentUserId"; 
interface ProjectDashboardProps {
  ideas: Idea[];
  setIdeas: React.Dispatch<React.SetStateAction<Idea[]>>;
  selectedIdeaId: number | null;
  onIdeaClick: (ideaId: number) => void;
  onToggleVote: (ideaId: number, userId: number, type: "up" | "down") => void;
  storageKey: string;
}

export default function ProjectDashboard({
  ideas,
  setIdeas,
  selectedIdeaId,
  onIdeaClick,
  onToggleVote,
  storageKey,
}: ProjectDashboardProps) {
  // Saves ideas
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(ideas));
  }, [ideas, storageKey]);
  const currentUserId = useCurrentUserId();
  const handleDragEnd = (
    e: React.DragEvent<HTMLDivElement>,
    ideaId: number
  ) => {
    const board = e.currentTarget.parentElement?.getBoundingClientRect();
    if (!board) return;

    const ideaWidth = 200;
    const ideaHeight = 120;

    let newX = e.clientX - board.left;
    let newY = e.clientY - board.top;

    newX = Math.max(0, Math.min(newX, board.width - ideaWidth));
    newY = Math.max(0, Math.min(newY, board.height - ideaHeight));

    setIdeas((prev) =>
      prev.map((idea) =>
        idea.id === ideaId ? { ...idea, x: newX, y: newY } : idea
      )
    );
  };


  return (
    <div
      style={{
        width: "66%",
        background: "#fff",
        border: "2px dashed #ccc",
        position: "relative",
        overflow: "auto",
      }}
    >
      <div
        style={{
          width: "1220px",
          height: "800px",
          position: "relative",
        }}
      >
        {ideas.map((idea) => (
          <IdeaBox
            key={idea.id}
            idea={idea}
            isSelected={idea.id === selectedIdeaId}
            onDragEnd={(e) => handleDragEnd(e, idea.id)}
            onClick={() => onIdeaClick(idea.id)}
            currentUserId={currentUserId}
            onToggleVote={onToggleVote}
          />
        ))}
      </div>
    </div>
  );
}
