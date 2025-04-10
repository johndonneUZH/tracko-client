"use client";

import { Idea } from "@/types/idea";
import IdeaBox from "./IdeaBox";
import { useCurrentUserId } from "@/lib/commons/useCurrentUserId";

interface ProjectDashboardProps {
  ideas: Idea[];
  selectedIdeaId: string | null;
  onIdeaClick: (ideaId: string) => void;
  updateIdea: (ideaId: string, data: Partial<Idea>) => Promise<Idea>;
  onToggleVote: (ideaId: string, userId: string, type: "up" | "down") => void;

}

export default function ProjectDashboard({
  ideas,
  selectedIdeaId,
  onIdeaClick,
  updateIdea,
  onToggleVote,
}: ProjectDashboardProps) {
  const currentUserId = useCurrentUserId();

  const getAdjustedPosition = (
    startX: number,
    startY: number,
    ideaId: string,
    ideaWidth: number,
    ideaHeight: number
  ) => {
    let adjustedX = startX;
    let adjustedY = startY;
    const maxIterations = 10;
    let iterations = 0;
    let collisionFound = true;

    while (collisionFound && iterations < maxIterations) {
      collisionFound = false;
      for (const other of ideas) {
        if (other.ideaId === ideaId) continue;

        if (
          adjustedX < other.x + ideaWidth &&
          adjustedX + ideaWidth > other.x &&
          adjustedY < other.y + ideaHeight &&
          adjustedY + ideaHeight > other.y
        ) {
          collisionFound = true;
          const overlapX =
            Math.min(adjustedX + ideaWidth, other.x + ideaWidth) -
            Math.max(adjustedX, other.x);
          const overlapY =
            Math.min(adjustedY + ideaHeight, other.y + ideaHeight) -
            Math.max(adjustedY, other.y);

          if (overlapX < overlapY) {
            if (adjustedX < other.x) {
              adjustedX = other.x - ideaWidth;
            } else {
              adjustedX = other.x + ideaWidth;
            }
          } else {
            if (adjustedY < other.y) {
              adjustedY = other.y - ideaHeight;
            } else {
              adjustedY = other.y + ideaHeight;
            }
          }
        }
      }
      iterations++;
    }
    return { x: adjustedX, y: adjustedY };
  };

  const handleDragEnd = (
    e: React.DragEvent<HTMLDivElement>,
    ideaId: string
  ) => {
    const board = e.currentTarget.parentElement?.getBoundingClientRect();
    if (!board) return;

    const ideaWidth = 200;
    const ideaHeight = 120;

    let newX = e.clientX - board.left;
    let newY = e.clientY - board.top;

    newX = Math.max(0, Math.min(newX, board.width - ideaWidth));
    newY = Math.max(0, Math.min(newY, board.height - ideaHeight));

    const adjusted = getAdjustedPosition(newX, newY, ideaId, ideaWidth, ideaHeight);

    adjusted.x = Math.max(0, Math.min(adjusted.x, board.width - ideaWidth));
    adjusted.y = Math.max(0, Math.min(adjusted.y, board.height - ideaHeight));


    updateIdea(ideaId, { x: adjusted.x, y: adjusted.y });
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
            key={idea.ideaId}
            idea={idea}
            isSelected={idea.ideaId === selectedIdeaId}
            onDragEnd={(e) => handleDragEnd(e, idea.ideaId)}
            onClick={() => onIdeaClick(idea.ideaId)}
            currentUserId={currentUserId}
            onToggleVote={onToggleVote} 
          />
        ))}
      </div>
    </div>
  );
}