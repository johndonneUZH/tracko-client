import { ApiService } from "@/api/apiService";
import { getApiDomain } from "@/utils/domain";
import { Comment } from "@/types/comment";
import { useMemo, useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { connectWebSocket, disconnectWebSocket } from "@/lib/websocketService";
import { useRouter } from "next/navigation";

export function useComments(projectId: string, ideaId: string) {
  const api = useMemo(() => new ApiService(), []);
  const router = useRouter();

  // WebSocket for comment notifications (optional, can be removed if not needed)
  useEffect(() => {
    if (!ideaId) return;

    // Connect WebSocket
    const token = sessionStorage.getItem('token');
    const userId = sessionStorage.getItem('userId');
    if (!userId || !token) {
      console.error("User ID or token not found");
      router.push("/login");
      return;
    }

    const client = connectWebSocket(
      userId,
      ideaId,
      (data) => {
        if ("deletedId" in data) {
          console.log("Deleted comment:", data.deletedId);
        } else {
          console.log("New comment received:", data);
        }
      },
      `/topic/comments/${ideaId}`
    );

    return () => {
      disconnectWebSocket();
    };
  }, [ideaId]);

  const addComment = async (content: string, parentId?: string): Promise<Comment | null> => {
    try {
      const path = parentId
        ? `/projects/${projectId}/ideas/${ideaId}/comments/${parentId}`
        : `/projects/${projectId}/ideas/${ideaId}/comments`;

      const newComment = await api.post<Comment>(path, { commentText: content });
      api.postChanges("ADDED_COMMENT", projectId); // For analytics purpose
      return newComment;
    } catch (err) {
      console.error("Failed to add comment:", err);
      return null;
    }
  };

  const deleteComment = async (commentId: string): Promise<boolean> => {
    try {
      await api.delete(`/projects/${projectId}/ideas/${ideaId}/comments/${commentId}`);
      api.postChanges("DELETED_COMMENT", projectId); // For analytics purpose
      return true; 
    } catch (err) {
      console.error("Failed to delete comment:", err);
      return false;
    }
  };

  return {
    addComment,
    deleteComment,
  };
}