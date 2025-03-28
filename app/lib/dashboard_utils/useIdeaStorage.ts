import { useState, useEffect } from "react";
import { Idea } from "@/components/dashboard_Project/IdeaModal";

export function useIdeaStorage(projectId: string, currentUserId: number) {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [nextId, setNextId] = useState(1);
  const storageKey = `ideas-${projectId}`;

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const parsed: Idea[] = JSON.parse(saved);
      setIdeas(parsed);
      setNextId(
        parsed.length > 0 ? Math.max(...parsed.map((i) => i.id)) + 1 : 1
      );
    }
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(ideas));
  }, [ideas, storageKey]);

  const createIdea = () => {
    const newId = nextId;
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
    setIdeas((prev) => [...prev, newIdea]);
    setNextId((prev) => prev + 1);
    return newIdea;
  };

  const saveIdea = (id: number, newTitle: string, newBody: string) => {
    setIdeas((prev) =>
      prev.map((idea) =>
        idea.id === id ? { ...idea, title: newTitle, body: newBody } : idea
      )
    );
  };

  const deleteIdea = (id: number) => {
    setIdeas((prev) => prev.filter((idea) => idea.id !== id));
  };

  const getSelectedIdea = (ideaId: string | undefined) => {
    const selectedId = parseInt(ideaId || "", 10);
    return ideas.find((idea) => idea.id === selectedId) || null;
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