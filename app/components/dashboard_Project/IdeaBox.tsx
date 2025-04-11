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
  // Array with 8 pastel colors
  const pastelColors = [
    "#FFB3BA", // pastel red
    "#FFDFBA", // pastel orange
    "#FFFFBA", // pastel yellow
    "#BAFFC9", // pastel green
    "#BAE1FF", // pastel blue
    "#E6E6FA", // lavender
    "#FADADD", // pastel pink
    "#D1C4E9", // pastel purple
  ];
  // Rotate colors based on idea id modulo the array length
  const backgroundColor = pastelColors[parseInt(idea.ideaId, 16) % pastelColors.length];

  // Inner shadow for improved design
  const innerShadow = "inset 0 4px 6px rgba(0, 0, 0, 0.1)";
  // Combine selection outline with inner shadow if selected
  const boxShadow = isSelected
    ? `0 0 0 2px #91caff, ${innerShadow}`
    : innerShadow;

  return (
    <div
      key={idea.ideaId}
      className="idea-box hover:scale-105 transition-transform duration-200 rounded-lg"
      draggable
      onDragEnd={(e) => onDragEnd(e, idea.ideaId)}
      onClick={() => onClick(idea.ideaId)}
      style={{
        position: "absolute",
        left: idea.x,
        top: idea.y,
        width: "200px",
        height: "120px",
        border: isSelected ? "2px solid #1677ff" : "1px solid #ccc",
        boxShadow,
        backgroundColor, // Assigned dynamic pastel color
        cursor: "pointer",
        overflow: "hidden",
        padding: "1rem",
      }}
    >
      <strong>{idea.ideaName || "Untitled Idea"}</strong>
      {/* Votes positioned at the bottom-right*/}
      <div style={{ position: "absolute", bottom: "1rem", right: "1rem" }}>
        <Votes idea={idea} currentUserId={currentUserId} onToggleVote={onToggleVote} 
        /> 
      </div> 
    </div>
  );
}