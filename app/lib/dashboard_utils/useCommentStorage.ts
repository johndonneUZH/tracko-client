"use client";

import { useCallback, useEffect, useMemo } from "react";
import { IMessage } from "@stomp/stompjs";
import { ApiService } from "@/api/apiService";
import { Comment } from "@/types/comment";
import { useWebSocket } from "@/hooks/WebSocketContext";

/* ---------- type‑guards ---------- */
const isDelete = (d: unknown): d is { deletedId: string } =>
  typeof d === "object" && d !== null && "deletedId" in d;

const isCommentPayload = (d: unknown): d is { comment: Comment } =>
  typeof d === "object" && d !== null && "comment" in d;

const isBareComment = (d: unknown): d is Comment =>
  typeof d === "object" && d !== null && "commentId" in d;

/* ---------- hook ---------- */
export function useComments(projectId: string, ideaId: string) {
  const api = useMemo(() => new ApiService(), []);
  const { subscribe, unsubscribe } = useWebSocket();

  /*  WebSocket */
  const handleMessage = useCallback((msg: IMessage) => {
    const payload: unknown = JSON.parse(msg.body);

    if (isDelete(payload)) {
      console.log("deleted comment:", payload.deletedId);
    } else if (isCommentPayload(payload)) {
      console.log("comment obtained:", payload.comment);
    } else if (isBareComment(payload)) {
      console.log("comment obtained:", payload);
    }
  }, []);

  /*  */
  useEffect(() => {
    if (!ideaId) return;

    const topic = `/topic/comments/${ideaId}`;
    subscribe(topic, handleMessage);
    return () => unsubscribe(topic);
  }, [ideaId, subscribe, unsubscribe, handleMessage]);

  /*  REST */
  const addComment = async (
    content: string,
    parentId?: string
  ): Promise<Comment | null> => {
    try {
      const path = parentId
        ? `/projects/${projectId}/ideas/${ideaId}/comments/${parentId}`
        : `/projects/${projectId}/ideas/${ideaId}/comments`;

      const newComment = await api.post<Comment>(path, { commentText: content });
      api.postChanges("ADDED_COMMENT", projectId); // analytics
      return newComment;
    } catch (err) {
      console.error("Failed to add comment:", err);
      return null;
    }
  };

  const deleteComment = async (commentId: string): Promise<boolean> => {
    try {
      await api.delete(`/projects/${projectId}/ideas/${ideaId}/comments/${commentId}`);
      api.postChanges("DELETED_COMMENT", projectId);
      return true;
    } catch (err) {
      console.error("Failed to delete comment:", err);
      return false;
    }
  };

  return { addComment, deleteComment };
}
