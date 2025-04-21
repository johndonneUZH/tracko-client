"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { IMessage } from "@stomp/stompjs";
import { Idea } from "@/types/idea";
import { ApiService } from "@/api/apiService";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getApiDomain } from "@/utils/domain";
import { useRouter } from "next/navigation";
import { connectWebSocket, disconnectWebSocket } from "../websocketService";
import { toast } from "sonner";

/* ---------- hook ---------- */
export function useIdeas(projectId: string) {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wsError, setWsError] = useState<string | null>(null);
  const apiService = useMemo(() => new ApiService(), []);
  const router = useRouter();

  // Handle incoming WebSocket messages
  const handleMessage = (message: any) => {
    if ("deletedId" in message) {
      setIdeas((prev) => prev.filter((i) => i.ideaId !== message.deletedId));
    } else {
      setIdeas((prev) => {
        const exists = prev.find((i) => i.ideaId === message.ideaId);
        if (exists) {
          return prev.map((i) => (i.ideaId === message.ideaId ? message : i));
        } else {
          return [...prev, message];
        }
      });
    }
  };

  // Initial fetch and WebSocket setup
  useEffect(() => {
    if (!projectId) return;

    let isMounted = true;

    async function fetchIdeas() {
      try {
        setLoading(true);
        const response = await apiService.get<Idea[]>(`/projects/${projectId}/ideas`);
        if (isMounted) setIdeas(response);
      } catch (err: unknown) {
        if (isMounted) {
          console.error("Error fetching ideas:", err);
          setError(err instanceof Error ? err.message : "Failed to fetch ideas.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
  }, [projectId, api]);

    fetchIdeas();

    // Connect WebSocket
    const token = sessionStorage.getItem('token');
    const userId = sessionStorage.getItem('userId');
    if (!token || !userId) {
      setWsError("Authentication token or userId not found");
      router.push("/login"); 
      return;
    }

    const client = connectWebSocket(
      userId,
      projectId,
      handleMessage
    );

    return () => {
      isMounted = false;
      disconnectWebSocket();
    };
  }, [projectId, apiService]); 

  async function createIdea(title: string, body: string | null) {
    const inputIdea = {
      ideaName: title,
      ideaDescription: body ? body : ""
    };

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
