"use client";

import React from "react";
import { Idea } from "./IdeaModal";

interface VotesProps {
  idea: Idea;
  currentUserId: number;
  onToggleVote: (ideaId: number, userId: number, type: "up" | "down") => void;
}

export default function Votes({ idea, currentUserId, onToggleVote }: VotesProps) {
  const hasUpvoted = idea.upvotesL.includes(currentUserId);
  const hasDownvoted = idea.downvotesL.includes(currentUserId);

  const handleVote = (type: "up" | "down") => {
    onToggleVote(idea.id, currentUserId, type);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.4rem",
        marginTop: "0.5rem",
        justifyContent: "flex-start",
      }}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleVote("up");
        }}
        style={{
          padding: "2px 6px",
          borderRadius: "4px",
          border: "1px solid #ccc",
          backgroundColor: hasUpvoted ? "#e6f7ff" : "#f9f9f9",
          cursor: "pointer",
        }}
      >
        ⬆️
      </button>
      <span>{idea.upvotesL.length}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleVote("down");
        }}
        style={{
          padding: "2px 6px",
          borderRadius: "4px",
          border: "1px solid #ccc",
          backgroundColor: hasDownvoted ? "#fff1f0" : "#f9f9f9",
          cursor: "pointer",
        }}
      >
        ⬇️
      </button>
      <span>{idea.downvotesL.length}</span>
    </div>
  );
}
