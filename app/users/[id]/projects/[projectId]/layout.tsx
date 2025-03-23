"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

interface Idea {
  id: number;
  content: string;
}

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { id, projectId, ideaId } = useParams();
  const router = useRouter();

  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [nextId, setNextId] = useState(1);

  // Creates an idea
  const createIdea = () => {
    const newIdea: Idea = { id: nextId, content: "" };
    setIdeas((prev) => [...prev, newIdea]);
    setNextId((prev) => prev + 1);
    // changes url without changing page
    router.push(`/users/${id}/projects/${projectId}/ideas/${nextId}`);
  };

  // Edits content
  const handleContentChange = (ideaId: number, value: string) => {
    setIdeas((prev) =>
      prev.map((idea) =>
        idea.id === ideaId ? { ...idea, content: value } : idea
      )
    );
  };

  const selectedIdeaId = parseInt(ideaId as string) || null;

  return (
    <div style={{ height: "100vh", padding: "2rem", background: "#eaf4fc" }}>
      <h1>Project {projectId} - Ideas</h1>
      <button onClick={createIdea}>+ Add Idea</button>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginTop: "2rem" }}>
        {ideas.map((idea) => (
          <textarea
            key={idea.id}
            onClick={() =>
              router.push(`/users/${id}/projects/${projectId}/ideas/${idea.id}`)
            }
            value={idea.content}
            onChange={(e) => handleContentChange(idea.id, e.target.value)}
            placeholder={`Idea ${idea.id}`}
            style={{
              width: "200px",
              height: "120px",
              padding: "1rem",
              resize: "none",
              border:
                idea.id === selectedIdeaId ? "2px solid #1677ff" : "1px solid #ccc",
              boxShadow:
                idea.id === selectedIdeaId ? "0 0 0 2px #91caff" : "none",
              outline: "none",
              background: "#fff",
              fontSize: "14px",
              cursor: "pointer",
            }}
          />
        ))}
      </div>

      {}
      {children}
    </div>
  );
}
