import { useEffect, useState } from "react";
import { Comment } from "@/types/comment";
import { ApiService } from "@/api/apiService";

export function useCommentFetcher(projectId: string, ideaId: string) {
  const [commentMap, setCommentMap] = useState<Record<string, Comment>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      setError(null);
      try {
        const api = new ApiService();
        const comments: Comment[] = await api.get(`/projects/${projectId}/ideas/${ideaId}/comments`);

        const map: Record<string, Comment> = {};
        comments.forEach((comment) => {
          map[comment.commentId] = comment;
        });

        setCommentMap(map);
      } catch (err: any) {
        console.error("Error fetching comments:", err);
        setError("Failed to load comments.");
      } finally {
        setLoading(false);
      }
    };

    if (projectId && ideaId) fetchComments();
  }, [projectId, ideaId]);

  return {
    commentMap,
    loading,
    error,
  };
}
