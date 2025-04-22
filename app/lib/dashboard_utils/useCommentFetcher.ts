"use client";

import { useCallback, useEffect, useState } from "react";
import { IMessage } from "@stomp/stompjs";
import { Comment } from "@/types/comment";
import { ApiService } from "@/api/apiService";
import { useWebSocket } from "@/hooks/WebSocketContext";

type WSMsg =
  | { deletedId: string }
  | { comment: Comment; parentId?: string }
  | Comment;

export function useCommentFetcher(projectId: string, ideaId: string) {
  const [commentMap, setCommentMap] = useState<Record<string, Comment>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { subscribe, unsubscribe } = useWebSocket();

  /* -------- initial fetch -------- */
  const fetchComments = useCallback(async () => {
    if (!projectId || !ideaId) return;
    setLoading(true);
    setError(null);
    try {
      const api = new ApiService();
      const data = await api.get<Comment[]>(
        `/projects/${projectId}/ideas/${ideaId}/comments`,
      );
      setCommentMap(Object.fromEntries(data.map(c => [c.commentId, c])));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load comments.");
    } finally {
      setLoading(false);
    }
  }, [projectId, ideaId]);

  useEffect(() => { fetchComments(); }, [fetchComments]);

  /* -------- parsed handler -------- */
  const handleParsed = useCallback((msg: WSMsg) => {
    setCommentMap(prev => {
      const map = { ...prev };

      if ("deletedId" in msg) {
        delete map[msg.deletedId];

      } else if ("comment" in msg) {
        const c = msg.comment;
        map[c.commentId] = c;

        if (msg.parentId && map[msg.parentId]) {
          const parent = { ...map[msg.parentId] };
          if (!parent.replies.includes(c.commentId)) {
            parent.replies = [...parent.replies, c.commentId];
            map[parent.commentId] = parent;
          }
        }

      } else if ("commentId" in msg) {
        map[msg.commentId] = msg;
      }
      return map;
    });
  }, []);

  /* -------- wrapper for subscribe -------- */
  const wsCallback = useCallback(
    (m: IMessage) => {
      try {
        handleParsed(JSON.parse(m.body) as WSMsg);
      } catch (e) {
        console.error("WS parse error:", e);
      }
    },
    [handleParsed],
  );

  useEffect(() => {
    if (!ideaId) return;
    const topic = `/topic/comments/${ideaId}`;
    subscribe(topic, wsCallback);
    return () => unsubscribe(topic);
  }, [ideaId, subscribe, unsubscribe, wsCallback]);

  return { commentMap, loading, error, refreshComments: fetchComments };
}
