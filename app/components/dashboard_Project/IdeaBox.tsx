"use client";

import React from "react";
import { Idea } from "@/types/idea";
import Votes from "./Votes";
import { Card, CardContent } from "@/components/commons/card";

interface IdeaBoxProps {
  idea: Idea;
  isSelected: boolean;
  onDragEnd: (e: React.DragEvent<HTMLDivElement>, ideaId: string) => void;
  onClick: (ideaId: string) => void;
  currentUserId: string;
  onToggleVote: (ideaId: string, userId: string, type: "up" | "down") => void;
}

export default function IdeaBox({
  idea,
  isSelected,
  onDragEnd,
  onClick,
  currentUserId,
  onToggleVote,
}: IdeaBoxProps) {
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

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    const dragImage = new Image();
    dragImage.src =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    e.dataTransfer.setDragImage(dragImage, 0, 0);
    e.dataTransfer.setData("text/plain", idea.ideaId);
  };

  return (
    <Card
      key={idea.ideaId}
      className={`absolute w-[200px] h-[120px] p-4 rounded-2xl select-none transition-transform duration-200 hover:scale-105 cursor-grab`}
      style={{
        left: `${idea.x}px`,
        top: `${idea.y}px`,
        zIndex: isSelected ? 10 : 1,
        touchAction: "none",
        userSelect: "none",
      }}
      draggable
      onDragStart={handleDragStart}
      onDragOver={(e) => e.preventDefault()}
      onDragEnd={(e) => onDragEnd(e, idea.ideaId)}
      onClick={() => onClick(idea.ideaId)}
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
          <Votes idea={idea} currentUserId={currentUserId} onToggleVote={onToggleVote} />
        </div>
      </CardContent>
    </Card>
  );
}
