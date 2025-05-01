"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { v4 as uuid } from "uuid";
import { Idea } from "@/types/idea";
import { ApiService } from "@/api/apiService";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { connectWebSocket, disconnectWebSocket } from "../websocketService";

/* ---------websocketService --------- */
type WebSocketMessage = {
  deletedId?: string;
  ideaId?: string;
  [key: string]: unknown;
};

export function useIdeas(projectId: string) {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wsError, setWsError] = useState<string | null>(null);

  const api = useMemo(() => new ApiService(), []);
  const router = useRouter();

  /* --------- handler WS  --------- */
  const handleIdeaMessage = useCallback((payload: WebSocketMessage) => {
    if (payload.deletedId) {
      setIdeas(prev => prev.filter(i => i.ideaId !== payload.deletedId));
      toast.success("Idea deleted");
      return;
    }

    if (
      payload.ideaId &&
      typeof payload.ideaName === "string" &&
      typeof payload.ideaDescription === "string"
    ) {
      const idea = payload as unknown as Idea;

      setIdeas(prev => {
        const exists = prev.some(i => i.ideaId === idea.ideaId);
        return exists
          ? prev.map(i => (i.ideaId === idea.ideaId ? idea : i))
          : [...prev, idea];
      });
    }
  }, []);

  const handleChangeMessage = useCallback((payload: WebSocketMessage) => {
      console.log("Change WebSocket message received:", payload);
  }, []);

  const handleUserMessage = useCallback((payload: WebSocketMessage) => {
      console.log("User WebSocket message received:", payload);
  }, []);

  /* --------- fetch WS --------- */
  useEffect(() => {
    if (!projectId) return;

    let alive = true;

    (async () => {
      try {
        setLoading(true);
        const data = await api.get<Idea[]>(`/projects/${projectId}/ideas`);
        console.log("Ideas: ", data)
        if (alive) {
  const uniqueIdeas = Array.from(new Map(data.map(idea => [idea.ideaId, idea])).values());
  setIdeas(uniqueIdeas);
}
      } catch (err) {
        if (alive) {
          console.error(err);
          setError(err instanceof Error ? err.message : "Failed to fetch ideas");
          toast.error("Failed to load ideas");
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();

    const token = sessionStorage.getItem("token");
    const userId = sessionStorage.getItem("userId");
    if (!token || !userId) {
      setWsError("Authentication token or userId not found");
      router.push("/login");
      return;
    }

    connectWebSocket(
      userId, 
      projectId, 
      handleIdeaMessage,
      handleChangeMessage,
      handleUserMessage
  );

    return () => {
      alive = false;
      disconnectWebSocket();
    };
  }, [projectId, api, router, handleIdeaMessage]);

  /* --------- optimistic create --------- */
  const createIdea = async (
    title: string,
    body: string | null,
    coords?: { x: number; y: number }
  ) => {
    let tmpId = uuid();
    if (ideas.some(i => i.ideaId === tmpId)) {
      tmpId = uuid(); // Generate a new one
    }
    const ownerId = sessionStorage.getItem("userId") ?? "temp-user";
    const { x, y } = coords ?? { x: 100, y: 100 };

    const optimistic: Idea = {
      ideaId: tmpId,
      projectId,
      ownerId,
      ideaName: title,
      ideaDescription: body ?? "",
      x,
      y,
      comments: [],
      upVotes: [],
      downVotes: [],
    };

    setIdeas(prev => [...prev, optimistic]);

    try {
      const input = { ideaName: title, ideaDescription: body ?? "", x, y };
      const real = await api.post<Idea>(`/projects/${projectId}/ideas`, input);

      setIdeas(prev => prev.map(i => (i.ideaId === tmpId ? real : i)));
      return real;
    } catch (err) {
      setIdeas(prev => prev.filter(i => i.ideaId !== tmpId));
      toast.error("Failed to create idea");
      throw err;
    }
  };

  /* --------- optimistic update --------- */
  const updateIdea = async (ideaId: string, data: Partial<Idea>) => {
    const snapshot = ideas.find(i => i.ideaId === ideaId);
    if (!snapshot) return;

    setIdeas(prev => prev.map(i => (i.ideaId === ideaId ? { ...i, ...data } : i)));

    try {
      const real = await api.put<Idea>(
        `/projects/${projectId}/ideas/${ideaId}`,
        data
      );
      return real;
    } catch (err) {
      setIdeas(prev => prev.map(i => (i.ideaId === ideaId ? snapshot : i)));
      toast.error("Failed to update idea");
      throw err;
    }
  };

  /* --------- optimistic delete --------- */
  const deleteIdea = async (ideaId: string) => {
    const snapshot = ideas.find(i => i.ideaId === ideaId);
    if (!snapshot) return false;

    setIdeas(prev => prev.filter(i => i.ideaId !== ideaId));

    try {
      await api.delete(`/projects/${projectId}/ideas/${ideaId}`);
      return true;
    } catch {
      setIdeas(prev => [...prev, snapshot]);
      toast.error("Failed to delete idea");
      return false;
    }
    
  };

  return {
    ideas,
    loading,
    error: error || wsError,
    createIdea,
    updateIdea,
    deleteIdea,
  };
}
