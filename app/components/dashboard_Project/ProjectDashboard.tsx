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
  // Save ideas to localStorage on changes
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(ideas));
  }, [ideas, storageKey]);

  const currentUserId = useCurrentUserId();


  // Adjusts the position so that the moved box doesn't overlap any other box.
  // It "snaps" the moved box to the edge of any colliding box.
  const getAdjustedPosition = (
    startX: number,
    startY: number,
    ideaId: number,
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
        if (other.id === ideaId) continue;
        // Check if the current position collides with the other box
        if (
          adjustedX < other.x + ideaWidth &&
          adjustedX + ideaWidth > other.x &&
          adjustedY < other.y + ideaHeight &&
          adjustedY + ideaHeight > other.y
        ) {
          collisionFound = true;
          // Compute the overlapping amounts in horizontal and vertical directions
          const overlapX =
            Math.min(adjustedX + ideaWidth, other.x + ideaWidth) -
            Math.max(adjustedX, other.x);
          const overlapY =
            Math.min(adjustedY + ideaHeight, other.y + ideaHeight) -
            Math.max(adjustedY, other.y);

          // Adjust in the direction of minimal overlap
          if (overlapX < overlapY) {
            // Snap horizontally: if our box is to the left of the other, move left; otherwise, move right.
            if (adjustedX < other.x) {
              adjustedX = other.x - ideaWidth;
            } else {
              adjustedX = other.x + ideaWidth;
            }
          } else {
            // Snap vertically: if our box is above the other, move up; otherwise, move down.
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
    ideaId: number
  ) => {
    const board = e.currentTarget.parentElement?.getBoundingClientRect();
    if (!board) return;

    const ideaWidth = 200;
    const ideaHeight = 120;

    // Calculate new position relative to the board
    let newX = e.clientX - board.left;
    let newY = e.clientY - board.top;

    // Keep the box within the board boundaries
    newX = Math.max(0, Math.min(newX, board.width - ideaWidth));
    newY = Math.max(0, Math.min(newY, board.height - ideaHeight));

    // Adjust the position to snap to the edge of any colliding box
    const adjusted = getAdjustedPosition(newX, newY, ideaId, ideaWidth, ideaHeight);

    // Clamp again to board boundaries
    adjusted.x = Math.max(0, Math.min(adjusted.x, board.width - ideaWidth));
    adjusted.y = Math.max(0, Math.min(adjusted.y, board.height - ideaHeight));

    // Update the position of the dragged idea
    setIdeas((prev) =>
      prev.map((idea) =>
        idea.id === ideaId ? { ...idea, x: adjusted.x, y: adjusted.y } : idea
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
