"use client";

import React from "react";
import { Idea } from "@/types/idea";
import Votes from "./Votes";
import { Card, CardContent } from "@/components/commons/card";
import { useDraggable } from "@dnd-kit/core";

interface IdeaBoxProps {
  idea: Idea;
  isSelected: boolean;
  onClick: (ideaId: string) => void;
  currentUserId: string;
  onToggleVote: (ideaId: string, userId: string, type: "up" | "down") => void;
}

export default function IdeaBox({
  idea,
  isSelected,
  onClick,
  currentUserId,
  onToggleVote,
}: IdeaBoxProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: idea.ideaId,
  });

  const pastelColors = [
    "#FFB3BA", "#FFDFBA", "#FFFFBA", "#BAFFC9",
    "#BAE1FF", "#E6E6FA", "#FADADD", "#D1C4E9",
  ];

  const getColorForIdea = (id: string) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return pastelColors[Math.abs(hash) % pastelColors.length];
  };

  const style = {
    left: `${idea.x}px`,
    top: `${idea.y}px`,
    zIndex: isSelected ? 10 : 1,
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition: isDragging ? "none" : "transform 0.15s ease-in-out",
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`absolute w-[200px] h-[120px] p-4 rounded-2xl select-none ${
        isDragging ? "" : "hover:scale-105"
      } cursor-grab`}
      onClick={() => !isDragging && onClick(idea.ideaId)}
      {...listeners}
      {...attributes}
    >
      <CardContent className="flex flex-col justify-between h-full p-0">
        <div className="mb-2">
          <strong className="block text-sm font-semibold text-gray-900 truncate">
            {idea.ideaName || "Untitled Idea"}
          </strong>
          <p className="text-sm text-gray-700 line-clamp-3">
            {idea.ideaDescription}
          </p>
        </div>
        <div className="self-end">
          <Votes
            idea={idea}
            currentUserId={currentUserId}
            onToggleVote={onToggleVote}
          />
        </div>
      </CardContent>
    </Card>
  );
}