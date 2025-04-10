import { Idea } from "@/types/idea";
export function generateNewIdea(nextId: number, creatorId: number): Idea {
  return {
    id: nextId,
    title: "",
    body: "",
    x: 100 + nextId * 15,
    y: 100 + nextId * 15,
    creatorId,
    comments: [],
    upvotesL: [],   
    downvotesL: [],
  };
}

export function isIdeaEmpty(idea: Idea): boolean {
  return idea.title.trim() === "" && idea.body.trim() === "";
}