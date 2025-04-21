"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { IMessage } from "@stomp/stompjs";
import { Idea } from "@/types/idea";
import { ApiService } from "@/api/apiService";
import { useWebSocket } from "@/hooks/WebSocketContext";

/* ---------- type‑guards ---------- */
const isDelete = (d: unknown): d is { deletedId: string } =>
  typeof d === "object" && d !== null && "deletedId" in d;

const isIdea = (d: unknown): d is Idea =>
  typeof d === "object" && d !== null && "ideaId" in d;

/* ---------- hook ---------- */
export function useIdeas(projectId: string) {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const api = useMemo(() => new ApiService(), []);
  const { subscribe, unsubscribe } = useWebSocket();

  /* fetch */
  const fetchIdeas = useCallback(async () => {
    if (!projectId) return;

    setLoading(true);
    setError(null);
    try {
      const data = await api.get<Idea[]>(`/projects/${projectId}/ideas`);
      setIdeas(data);
    } catch (err) {
      console.error("Error fetching ideas:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch ideas.");
    } finally {
      setLoading(false);
    }
  }, [projectId, api]);

  useEffect(() => { fetchIdeas(); }, [fetchIdeas]);

  /*  WebSocket */
  const handleMessage = useCallback((msg: IMessage) => {
    const payload: unknown = JSON.parse(msg.body);

    if (isDelete(payload)) {
      setIdeas(prev => prev.filter(i => i.ideaId !== payload.deletedId));
    } else if (isIdea(payload)) {
      setIdeas(prev => {
        const exists = prev.some(i => i.ideaId === payload.ideaId);
        return exists
          ? prev.map(i => (i.ideaId === payload.ideaId ? payload : i))
          : [...prev, payload];
      });
    }
  }, []);

  /*  */
  useEffect(() => {
    if (!projectId) return;

    const topic = `/topic/ideas/${projectId}`;
    subscribe(topic, handleMessage);
    return () => unsubscribe(topic);
  }, [projectId, subscribe, unsubscribe, handleMessage]);

  /*  REST */
  const createIdea = async (title: string, body: string | null) => {
    const inputIdea = { ideaName: title, ideaDescription: body ?? "" };
    const newIdea = await api.post<Idea>(`/projects/${projectId}/ideas`, inputIdea);
    api.postChanges("ADDED_IDEA", projectId);
    return newIdea;
  };

  const updateIdea = async (ideaId: string, data: Partial<Idea>) => {
    const updated = await api.put<Idea>(`/projects/${projectId}/ideas/${ideaId}`, data);
    api.postChanges("MODIFIED_IDEA", projectId);
    return updated;
  };

  const deleteIdea = async (ideaId: string) => {
    await api.delete(`/projects/${projectId}/ideas/${ideaId}`);
    api.postChanges("CLOSED_IDEA", projectId);
    return true;
  };

  return { ideas, loading, error, createIdea, updateIdea, deleteIdea };
}
