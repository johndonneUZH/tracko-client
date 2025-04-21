"use client";

import React from "react";
import { Idea } from "@/types/idea";
import Votes from "./Votes";

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

  const backgroundColor = getColorForIdea(idea.ideaId);
  const innerShadow = "inset 0 4px 6px rgba(0, 0, 0, 0.1)";
  const boxShadow = isSelected
    ? `0 0 0 2px #91caff, ${innerShadow}`
    : innerShadow;

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    const dragImage = new Image();
    dragImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    e.dataTransfer.setDragImage(dragImage, 0, 0);
    e.dataTransfer.setData('text/plain', idea.ideaId);
  };

  return (
    <div
      key={idea.ideaId}
      className="idea-box hover:scale-105 transition-transform duration-200 rounded-lg select-none"
      draggable
      onDragStart={handleDragStart}
      onDragOver={(e) => e.preventDefault()}
      onDragEnd={(e) => onDragEnd(e, idea.ideaId)}
      onClick={() => onClick(idea.ideaId)}
      style={{
        position: "absolute",
        left: `${idea.x}px`,
        top: `${idea.y}px`,
        width: "200px",
        height: "120px",
        border: isSelected ? "2px solid #1677ff" : "1px solid #ccc",
        boxShadow,
        backgroundColor,
        cursor: "grab",
        overflow: "hidden",
        padding: "1rem",
        touchAction: "none",
        userSelect: "none",
        zIndex: isSelected ? 10 : 1,
        willChange: "transform", // Improves animation performance
      }}
    >
      <strong>{idea.ideaName || "Untitled Idea"}</strong>
      <div style={{ position: "absolute", bottom: "1rem", right: "1rem" }}>
        <Votes idea={idea} currentUserId={currentUserId} onToggleVote={onToggleVote} />
      </div>
    </div>
  );
}