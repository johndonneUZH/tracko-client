import { ApiService } from "@/api/apiService";
import { Comment } from "@/types/comment";
import { useMemo, useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export function useComments(projectId: string, ideaId: string) {
  const api = useMemo(() => new ApiService(), []);
  const stompRef = useRef<Client | null>(null);

  // WebSocket
  useEffect(() => {
    if (!ideaId) return;

    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
    const socket = new SockJS(`${baseUrl}/ws`);
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        client.subscribe(`/topic/comments/${ideaId}`, (message) => {
          const data = JSON.parse(message.body);
          if ("deletedId" in data) {
            console.log("Comentario eliminado:", data.deletedId);
          } else {
            console.log("Comentario nuevo recibido:", data);
          }
        });
      },
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
    });

    client.activate();
    stompRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [ideaId]);

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

  return {
    addComment,
    deleteComment,
  };
}
