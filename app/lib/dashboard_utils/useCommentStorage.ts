import { Comment } from "@/types/comment";
import { Idea } from "@/types/idea";
export function useComments(
  setIdeas: React.Dispatch<React.SetStateAction<Idea[]>>,
  currentUserId: number
) {
  const addComment = (ideaId: number, content: string, parentId?: number) => {
    const newComment: Comment = {
      id: Date.now(),
      authorId: currentUserId,
      content,
      replies: [],
    };
    

    setIdeas((prev) =>
      prev.map((idea) => {
        if (idea.id !== ideaId) return idea;

        if (!parentId) {
          return {
            ...idea,
            comments: [...idea.comments, newComment],
          };
        } else {
          return {
            ...idea,
            comments: addReplyRecursive(idea.comments, parentId, newComment),
          };
        }
      })
    );
  };

  const addReplyRecursive = (
    commentList: Comment[],
    parentId: number,
    newComment: Comment
  ): Comment[] => {
    return commentList.map((c) => {
      if (c.id === parentId) {
        return { ...c, replies: [...c.replies, newComment] };
      } else {
        return {
          ...c,
          replies: addReplyRecursive(c.replies, parentId, newComment),
        };
      }
    });
  };

  const deleteComment = (ideaId: number, commentId: number) => {
    setIdeas((prev) =>
      prev.map((idea) => {
        if (idea.id !== ideaId) return idea;
        return {
          ...idea,
          comments: deleteCommentRecursive(
            idea.comments,
            commentId,
            currentUserId
          ),
        };
      })
    );
  };

  const deleteCommentRecursive = (
    commentList: Comment[],
    commentId: number,
    userId: number
  ): Comment[] => {
    return commentList
      .map((c) => {
        if (c.id === commentId && c.authorId === userId) {
          return null;
        }
        return {
          ...c,
          replies: deleteCommentRecursive(c.replies, commentId, userId),
        };
      })
      .filter(Boolean) as Comment[];
  };

  return {
    addComment,
    deleteComment,
  };
}