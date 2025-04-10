import { Comment } from "./comment";

export interface Idea {
  id: number;
  title: string;
  body: string;
  x: number;
  y: number;
  creatorId: number;
  comments: Comment[];
  upvotesL: number[];
  downvotesL: number[];
}

