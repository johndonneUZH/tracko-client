import { ApiService } from "@/api/apiService";
import { Comment } from "@/types/comment";
import { useMemo } from "react";

export function useComments(projectId: string, ideaId: string, userId: string) {
  const api = useMemo(() => new ApiService(), []);

  const addComment = async (content: string, parentId?: string): Promise<Comment | null> => {
    try {
      const path = parentId
        ? `/projects/${projectId}/ideas/${ideaId}/comments/${parentId}`
        : `/projects/${projectId}/ideas/${ideaId}/comments`;

      const newComment = await api.post<Comment>(path, { commentText: content });
      return newComment;
    } catch (err) {
      console.error("Failed to add comment:", err);
      return null;
    }
  };

  const deleteComment = async (commentId: string): Promise<boolean> => {
    try {
      await api.delete(`/projects/${projectId}/ideas/${ideaId}/comments/${commentId}`);
      return true;
    } catch (err) {
      console.error("Failed to delete comment:", err);
      return false;
    }
  };

  // const editComment = async (commentId: string, newContent: string): Promise<Comment | null> => {
  //   try {
  //     const updatedComment = await api.put<Comment>(
  //       `/projects/${projectId}/ideas/${ideaId}/comments/${commentId}`,
  //       { commentText: newContent }
  //     );
  //     return updatedComment;
  //   } catch (err) {
  //     console.error("Failed to edit comment:", err);
  //     return null;
  //   }
  // };

  return {
    addComment,
    deleteComment,
    // editComment,
  };
}
