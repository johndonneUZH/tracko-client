import { Idea } from "@/types/idea";

export function generateNewIdea(proId: string, nextId: string, ownerId: string): Idea {
  // Create a more random position using the ID and current timestamp
  const hash = hashCode(nextId + Date.now().toString());
  
  // Screen dimensions (adjust these based on your actual board size)
  const boardWidth = 1200;
  const boardHeight = 800;
  const ideaWidth = 200;
  const ideaHeight = 120;
  
  // Generate random positions within bounds
  const x = Math.abs(hash % (boardWidth - ideaWidth));
  const y = Math.abs((hash * 16777619) % (boardHeight - ideaHeight));
  
  return {
    projectId: proId,
    ideaId: nextId,
    ideaName: "",
    ideaDescription: "",
    x: x,
    y: y,
    ownerId,
    comments: [],
    downVotes: [],   
    upVotes: [],
  };
}

// Helper function to generate a numeric hash from string
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

export function isIdeaEmpty(idea: Idea): boolean {
  return idea.ideaName.trim() === "" && idea.ideaDescription.trim() === "";
}