"use client";

import React from "react";
import { Idea } from "./IdeaModal";
import Votes from "./Votes";
interface IdeaBoxProps {
  idea: Idea;
  isSelected: boolean;
  onDragEnd: (e: React.DragEvent<HTMLDivElement>, ideaId: number) => void;
  onClick: (ideaId: number) => void;
  currentUserId: number;
  onToggleVote: (ideaId: number, userId: number, type: "up" | "down") => void;
}

export default function IdeaBox({ idea, isSelected, onDragEnd, onClick, currentUserId, onToggleVote }: IdeaBoxProps) {
  return (
    <div
      key={idea.id}
      className="idea-box"
      draggable
      onDragEnd={(e) => onDragEnd(e, idea.id)}
      onClick={() => onClick(idea.id)}
      style={{
        position: "absolute",
        left: idea.x,
        top: idea.y,
        width: "200px",
        height: "120px",
        border: isSelected ? "2px solid #1677ff" : "1px solid #ccc",
        boxShadow: isSelected ? "0 0 0 2px #91caff" : "none",
        background: "#fff",
        cursor: "pointer",
        overflow: "hidden",
        padding: "1rem",
      }}
    >
      <strong>{idea.title || "Untitled Idea"}</strong>
      <Votes idea={idea} currentUserId={currentUserId} onToggleVote={onToggleVote} />
    </div>
  );
}
