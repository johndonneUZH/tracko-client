import { useEffect, useState } from "react";
import { Comment } from "@/types/comment";
import { ApiService } from "@/api/apiService";
import { connectWebSocket, disconnectWebSocket } from "@/lib/websocketService";
import { useRouter } from "next/navigation";

export function useCommentFetcher(projectId: string, ideaId: string) {
  const [commentMap, setCommentMap] = useState<Record<string, Comment>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wsError, setWsError] = useState<string | null>(null);
  const router = useRouter(); // Use Next.js router for navigation

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
    } catch (err: unknown) {
      console.error("Error fetching comments:", err);
      setError(err instanceof Error ? err.message : "Failed to load comments.");
    } finally {
      setLoading(false);
    }
  };

  // Handle incoming WebSocket messages
  const handleCommentMessage = (data: any) => {
    setCommentMap((prev) => {
      const updated = { ...prev };

      if ("deletedId" in data) {
        delete updated[data.deletedId];
      } else {
        const newComment: Comment = data.comment || data;
        updated[newComment.commentId] = newComment;

        const parentId = data.parentId;
        if (parentId && updated[parentId]) {
          const parent = { ...updated[parentId] };
          if (!parent.replies?.includes(newComment.commentId)) {
            parent.replies = [...(parent.replies || []), newComment.commentId];
            updated[parentId] = parent;
          }
        }
      }

      return updated;
    });
  };

  // Initial fetch and WebSocket setup
  useEffect(() => {
    if (!projectId || !ideaId) return;

    let isMounted = true;

    fetchComments();

    // Connect WebSocket
    const token = sessionStorage.getItem('token');
    const userId = sessionStorage.getItem('userId');
    if (!userId || !token) {
      setWsError("User ID or token not found");
      router.push("/login");
      return;
    }

    const client = connectWebSocket(
      userId,
      ideaId,
      handleCommentMessage,
      `/topic/comments/${ideaId}`
    );

    return () => {
      isMounted = false;
      disconnectWebSocket();
    };
  }, [projectId, ideaId]);

  return {
    commentMap,
    loading,
    error: error || wsError,
    refreshComments: fetchComments,
  };
}