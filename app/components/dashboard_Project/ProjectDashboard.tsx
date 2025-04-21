"use client";

import { Idea } from "@/types/idea";
import IdeaBox from "./IdeaBox";
import { useCurrentUserId } from "@/lib/commons/useCurrentUserId";
import { useRef, useState, useEffect } from "react";

interface ProjectDashboardProps {
  ideas: Idea[];
  selectedIdeaId: string | null;
  onIdeaClick: (ideaId: string) => void;
  updateIdea: (ideaId: string, data: Partial<Idea>) => Promise<Idea>;
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

  // Track container size
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

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>, ideaId: string) => {
    if (!containerRef.current) return;
  
    const containerRect = containerRef.current.getBoundingClientRect();
    const ideaWidth = 200;
    const ideaHeight = 120;
  
    // Get the mouse position relative to the container
    const mouseX = e.clientX - containerRect.left;
    const mouseY = e.clientY - containerRect.top;
  
    // Calculate new position (centering the idea box on the mouse)
    let newX = mouseX - (ideaWidth / 2);
    let newY = mouseY - (ideaHeight / 2);
  
    // Apply boundaries
    newX = Math.max(0, Math.min(newX, containerRect.width - ideaWidth));
    newY = Math.max(0, Math.min(newY, containerRect.height - ideaHeight));
  
    updateIdea(ideaId, { x: newX, y: newY });
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full bg-white overflow-hidden" // Changed from overflow-auto
      style={{ minHeight: '600px' }} // Fallback minimum height
    >
      <div 
        className="absolute inset-0" 
        style={{ 
          width: '100%',
          height: '100%',
          minHeight: containerSize.height > 0 ? containerSize.height : '600px'
        }}
      >
        {ideas.map((idea) => (
          <IdeaBox
            key={idea.ideaId}
            idea={idea}
            isSelected={idea.ideaId === selectedIdeaId}
            onDragEnd={(e) => handleDragEnd(e, idea.ideaId)}
            onClick={() => onIdeaClick(idea.ideaId)}
            currentUserId={currentUserId}
            onToggleVote={onToggleVote}
          />
        ))}
      </div>
    </div>
  );
}