"use client";

import { useCallback, useEffect, useState } from "react";
import { IMessage } from "@stomp/stompjs";
import { Comment } from "@/types/comment";
import { ApiService } from "@/api/apiService";
import { useWebSocket } from "@/hooks/WebSocketContext";

/* ---------- type‑guards ---------- */
const isDelete = (d: unknown): d is { deletedId: string } =>
  typeof d === "object" && d !== null && "deletedId" in d;

const isCommentPayload = (
  d: unknown
): d is { comment: Comment; parentId?: string } => {
  if (typeof d !== "object" || d === null) return false;
  return "comment" in d;
};

const isBareComment = (d: unknown): d is Comment =>
  typeof d === "object" && d !== null && "commentId" in d;

/* ---------- hook ---------- */
export function useCommentFetcher(projectId: string, ideaId: string) {
  const [commentMap, setCommentMap] = useState<Record<string, Comment>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { subscribe, unsubscribe } = useWebSocket();

  /* fetch  manual refresh */
  const fetchComments = useCallback(async () => {
    if (!projectId || !ideaId) return;

    setLoading(true);
    setError(null);
    try {
      const api = new ApiService();
      const comments = await api.get<Comment[]>(
        `/projects/${projectId}/ideas/${ideaId}/comments`
      );
      setCommentMap(Object.fromEntries(comments.map(c => [c.commentId, c])));
    } catch (err) {
      console.error("Error fetching comments:", err);
      setError(err instanceof Error ? err.message : "Failed to load comments.");
    } finally {
      setLoading(false);
    }
  }, [projectId, ideaId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  /*  WebSocket */
  const handleMessage = useCallback((msg: IMessage) => {
    const payload: unknown = JSON.parse(msg.body);

    setCommentMap(prev => {
      const map = { ...prev };

      if (isDelete(payload)) {
        delete map[payload.deletedId];

      } else if (isCommentPayload(payload)) {
        const c = payload.comment;
        map[c.commentId] = c;

        if (payload.parentId && map[payload.parentId]) {
          const parent = { ...map[payload.parentId] };
          if (!parent.replies.includes(c.commentId)) {
            parent.replies = [...parent.replies, c.commentId];
            map[parent.commentId] = parent;
          }
        }

      } else if (isBareComment(payload)) {
        map[payload.commentId] = payload;
      }

      return map;
    });
  }, []);

  useEffect(() => {
    if (!ideaId) return;

    const topic = `/topic/comments/${ideaId}`;
    subscribe(topic, handleMessage);
    return () => unsubscribe(topic);
  }, [ideaId, subscribe, unsubscribe, handleMessage]);

  return {
    commentMap,
    loading,
    error,
    refreshComments: fetchComments,
  };
}
