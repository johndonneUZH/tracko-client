import { useState, useEffect } from "react";
import { Idea } from "@/types/idea";

export function useIdeaStorage(projectId: string, currentUserId: number) {
  const storageKey = `ideas-${projectId}`;

  // Lazy Start
  const [ideas, setIdeas] = useState<Idea[]>(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  });

  // Update the localStorage
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(ideas));
  }, [ideas, storageKey]);

  // Hear the event estorage
  // Not really functional, but fun to play with.
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === storageKey && e.newValue) {
        const updatedIdeas = JSON.parse(e.newValue);
        // Update if cahnges
        setIdeas(updatedIdeas);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [storageKey]);

  const createIdea = () => {
    const newId = ideas.length > 0 ? Math.max(...ideas.map(i => i.id)) + 1 : 1;
    const newIdea: Idea = {
      id: newId,
      title: "",
      body: "",
      x: 100 + newId * 15,
      y: 100 + newId * 15,
      creatorId: currentUserId,
      comments: [],
      upvotesL: [],
      downvotesL: [],
    };
    setIdeas(prev => [...prev, newIdea]);
    return newIdea;
  };

  const saveIdea = (id: number, newTitle: string, newBody: string) => {
    setIdeas(prev =>
      prev.map(idea =>
        idea.id === id ? { ...idea, title: newTitle, body: newBody } : idea
      )
    );
  };

  const deleteIdea = (id: number) => {
    setIdeas(prev => prev.filter(idea => idea.id !== id));
  };

  const getSelectedIdea = (ideaId: string | undefined) => {
    const selectedId = parseInt(ideaId || "", 10);
    return ideas.find(idea => idea.id === selectedId) || null;
  };

  return {
    ideas,
    setIdeas,
    createIdea,
    saveIdea,
    deleteIdea,
    getSelectedIdea,
    storageKey,
  };
}
