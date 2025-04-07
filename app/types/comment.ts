export interface Comment {
    id: number;
    authorId: number;
    content: string;
    replies: Comment[];
  }