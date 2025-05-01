/* eslint-disable */
"use client";

import React from "react";
import { Idea } from "@/types/idea";
import Votes from "./Votes";
import { Card, CardContent } from "@/components/commons/card";
import { useDraggable } from "@dnd-kit/core";
import { User } from "@/types/user"

import {
  Avatar,
  AvatarImage,
} from "@/components/commons/avatar"

interface IdeaBoxProps {
  idea: Idea;
  isSelected: boolean;
  onClick: (ideaId: string) => void;
  currentUserId: string;
  onToggleVote: (ideaId: string, userId: string, type: "up" | "down") => void;
  members: User[];
}

export default function IdeaBox({
  idea,
  isSelected,
  onClick,
  currentUserId,
  onToggleVote,
  members,
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
    className={`absolute w-[200px] h-[160px] p-4 rounded-2xl select-none ${
      isDragging ? "" : "hover:scale-105"
    } cursor-grab`}
    onClick={() => !isDragging && onClick(idea.ideaId)}
    {...listeners}
    {...attributes}
  >
    <CardContent className="flex flex-col h-full p-0 overflow-hidden">
      <div className="flex-grow overflow-hidden">
        <div className="flex items-center gap-2 mb-1">
          <Avatar className="h-4 w-4 rounded-sm">
            <AvatarImage
              src={
                members.find((m) => m.id === idea.ownerId)?.avatarUrl ??
                "https://avatar.vercel.sh/john"
              }
            />
          </Avatar>
          <strong className="truncate">
            {members.find((m) => m.id === idea.ownerId)?.username ?? "Unknown"}
          </strong>
        </div>

        <strong className="block text-sm font-semibold text-gray-900 truncate">
          {idea.ideaName || "Untitled Idea"}
        </strong>

        <p className="text-sm text-gray-700 line-clamp-2 overflow-hidden">
          {idea.ideaDescription}
        </p>
      </div>

      <div className="mt-auto flex justify-end pt-1">
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