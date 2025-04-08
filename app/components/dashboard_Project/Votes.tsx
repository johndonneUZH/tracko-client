"use client";

import React from "react";
import { Idea } from "@/types/idea";

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

  // CalculaTE VOTES
  const netVotes = idea.upvotesL.length - idea.downvotesL.length;
 
  const netDisplay = netVotes > 0 ? `+${netVotes}` : netVotes.toString();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.4rem",
        marginTop: "0.5rem",
      }}
    >
      {/* COUNT */}
      <span style={{ fontWeight: "bold", color: "#000" }}>{netDisplay}</span>

      {/* Upvote */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleVote("up");
        }}
        style={{
          border: "none",
          backgroundColor: hasUpvoted ? "#eafff2" : "transparent",
          cursor: "pointer",
          borderRadius: "4px",
          padding: "2px 6px",
        }}
      >
        ▲
      </button>

      {/* Downvote */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleVote("down");
        }}
        style={{
          border: "none",
          backgroundColor: hasDownvoted ? "#fff1f0" : "transparent",
          cursor: "pointer",
          borderRadius: "4px",
          padding: "2px 6px",
        }}
      >
        ▼
      </button>
    </div>
  );
}
