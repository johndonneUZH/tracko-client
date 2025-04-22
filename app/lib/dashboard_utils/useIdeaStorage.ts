/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useCallback, useEffect, useMemo, useState } from "react";
import { Idea } from "@/types/idea";
import { ApiService } from "@/api/apiService";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { connectWebSocket, disconnectWebSocket } from "../websocketService";

export function useIdeas(projectId: string) {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wsError, setWsError] = useState<string | null>(null);
  const api = useMemo(() => new ApiService(), []);
  const router = useRouter();

  const handleMessage = useCallback((message: any) => {
    if ("deletedId" in message) {
      setIdeas((prev) => prev.filter((i) => i.ideaId !== message.deletedId));
      toast.success('Idea deleted');
    } else if (message.ideaId) {
      setIdeas((prev) => {
        const exists = prev.find((i) => i.ideaId === message.ideaId);
        if (exists) {
          return prev.map((i) => (i.ideaId === message.ideaId ? message : i));
        } else {
          return [...prev, message];
        }
      });
    }
  }, []);

  useEffect(() => {
    if (!projectId) return;

    let isMounted = true;

    async function fetchIdeas() {
      try {
        setLoading(true);
        const response = await api.get<Idea[]>(`/projects/${projectId}/ideas`);
        if (isMounted) setIdeas(response);
      } catch (err: unknown) {
        if (isMounted) {
          console.error("Error fetching ideas:", err);
          setError(err instanceof Error ? err.message : "Failed to fetch ideas.");
          toast.error("Failed to load ideas");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchIdeas();

    const token = sessionStorage.getItem('token');
    const userId = sessionStorage.getItem('userId');
    if (!token || !userId) {
      setWsError("Authentication token or userId not found");
      router.push("/login");
      return;
    }

    const client = connectWebSocket(userId, projectId, handleMessage);

    return () => {
      isMounted = false;
      disconnectWebSocket();
    };
  }, [projectId, api, router, handleMessage]);

  const createIdea = async (title: string, body: string | null) => {
    try {
      const inputIdea = {
        ideaName: title,
        ideaDescription: body || ""
      };

      // Only REST call - service will handle WebSocket notification
      const idea = await api.post<Idea>(`/projects/${projectId}/ideas`, inputIdea);
      return idea;
    } catch (error) {
      console.error("Error creating idea:", error);
      toast.error("Failed to create idea");
      throw error;
    }
  };

  const updateIdea = async (ideaId: string, data: Partial<Idea>) => {
    try {
      // Only REST call - service will handle WebSocket notification
      const updatedIdea = await api.put<Idea>(`/projects/${projectId}/ideas/${ideaId}`, data);
      return updatedIdea;
    } catch (error) {
      console.error("Error updating idea:", error);
      toast.error("Failed to update idea");
      throw error;
    }
  };

  const deleteIdea = async (ideaId: string) => {
    try {
      // Only REST call - service will handle WebSocket notification
      await api.delete(`/projects/${projectId}/ideas/${ideaId}`);
      return true;
    } catch (error) {
      console.error("Error deleting idea:", error);
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