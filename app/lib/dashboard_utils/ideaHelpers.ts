import { Idea } from "@/types/idea";
export function generateNewIdea(proId: string, nextId: string, creatorId: string): Idea {
  return {
    projectId: proId,
    ideaId: nextId,
    ideaName: "",
    ideaDescription: "",
    x: 100 + (parseInt(nextId, 16) % 25)  * 15,
    y: 100 + (parseInt(nextId, 16) % 25) * 15,
    creatorId,
    comments: [],
    downVotes: [],   
    upVotes: [],
  };
}

export function isIdeaEmpty(idea: Idea): boolean {
  return idea.ideaName.trim() === "" && idea.ideaDescription.trim() === "";
}
