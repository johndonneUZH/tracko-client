"use client";

import { useCallback, useMemo, useEffect } from "react";
import { IMessage } from "@stomp/stompjs";
import { ApiService } from "@/api/apiService";
import { Comment } from "@/types/comment";
import { useWebSocket } from "@/hooks/WebSocketContext";

/* payload already parsed */
type WebSocketMessage = {
  deletedId?: string;
  comment?: Comment;
  commentId?: string;
  [k: string]: unknown;
};

export function useComments(projectId: string, ideaId: string) {
  const api = useMemo(() => new ApiService(), []);
  const { subscribe, unsubscribe } = useWebSocket();

  /* ---- typed handler ---- */
  const handleParsed = useCallback((msg: WebSocketMessage) => {
    if (msg.deletedId) {
      console.log("Comment deleted:", msg.deletedId);
    } else if (msg.comment) {
      console.log("Comment received:", msg.comment);
    } else if (msg.commentId) {
      console.log("Comment received:", msg);
    }
  }, []);

  /* ---- wrapper that matches subscribe signature ---- */
  const wsCallback = useCallback(
    (m: IMessage) => {
      try {
        handleParsed(JSON.parse(m.body) as WebSocketMessage);
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


  /* ----- REST mutations ----- */
  const addComment = async (content: string, parentId?: string) => {
    try {
      const path = parentId
        ? `/projects/${projectId}/ideas/${ideaId}/comments/${parentId}`
        : `/projects/${projectId}/ideas/${ideaId}/comments`;

      const comment = await api.post<Comment>(path, { commentText: content });
      return comment;
    } catch (err) {
      console.error("Failed to add comment:", err);
      return null;
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      await api.delete(
        `/projects/${projectId}/ideas/${ideaId}/comments/${commentId}`,
      );
      return true;
    } catch (err) {
      console.error("Failed to delete comment:", err);
      return false;
    }
  };

  return { addComment, deleteComment };
}
