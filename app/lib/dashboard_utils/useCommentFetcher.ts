import { useEffect, useState, useRef } from "react";
import { Comment } from "@/types/comment";
import { ApiService } from "@/api/apiService";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export function useCommentFetcher(projectId: string, ideaId: string) {
  const [commentMap, setCommentMap] = useState<Record<string, Comment>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const stompRef = useRef<Client | null>(null);

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
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to load comments.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId && ideaId) fetchComments();
  }, [projectId, ideaId]);

  // WebSocket 
  useEffect(() => {
    if (!ideaId) return;

    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL; // || "http://localhost:8080"; for development only
    const socket = new SockJS(`${baseUrl}/ws`);
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        client.subscribe(`/topic/comments/${ideaId}`, (message) => {
          const data = JSON.parse(message.body);

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
                if (!parent.replies.includes(newComment.commentId)) {
                  parent.replies = [...parent.replies, newComment.commentId];
                  updated[parentId] = parent;
                }
              }
            }

            return updated;
          });
        });
      },
      debug: (str) => console.log("[WebSocket Comment Debug]", str),
      reconnectDelay: 5000,
    });

    client.activate();
    stompRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [ideaId]);

  return {
    commentMap,
    loading,
    error,
    refreshComments: fetchComments,
  };
}
