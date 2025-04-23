"use client";

import { Idea } from "@/types/idea";
import IdeaBox from "./IdeaBox";
import { useCurrentUserId } from "@/lib/commons/useCurrentUserId";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import { useRef, useState, useEffect } from "react";

interface ProjectDashboardProps {
  ideas: Idea[];
  selectedIdeaId: string | null;
  onIdeaClick: (ideaId: string) => void;
  updateIdea: (ideaId: string, data: Partial<Idea>) => void;
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateSize();
    const resizeObserver = new ResizeObserver(updateSize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    const draggedIdea = ideas.find((idea) => idea.ideaId === active.id);
    if (!draggedIdea || !containerRef.current) return;

    const newX = Math.max(
      0,
      Math.min(draggedIdea.x + delta.x, containerSize.width - 200)
    );
    const newY = Math.max(
      0,
      Math.min(draggedIdea.y + delta.y, containerSize.height - 120)
    );

    updateIdea(active.id as string, { x: newX, y: newY });
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div
        ref={containerRef}
        className="relative w-full h-full bg-white overflow-hidden"
        style={{ minHeight: "600px" }}
      >
        <div
          className="absolute inset-0"
          style={{
            width: "100%",
            height: "100%",
            minHeight: containerSize.height > 0 ? containerSize.height : "600px",
          }}
        >
          {ideas.map((idea) => (
            <IdeaBox
              key={idea.ideaId}
              idea={idea}
              isSelected={idea.ideaId === selectedIdeaId}
              onClick={onIdeaClick}
              currentUserId={currentUserId}
              onToggleVote={onToggleVote}
            />
          ))}
        </div>
      </div>
    </DndContext>
  );
}