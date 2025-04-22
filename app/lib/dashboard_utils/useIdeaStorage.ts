/* eslint-disable */
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Idea } from "@/types/idea";
import { ApiService } from "@/api/apiService";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { connectWebSocket, disconnectWebSocket, sendMessage } from "../websocketService";

export function useIdeas(projectId: string) {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wsError, setWsError] = useState<string | null>(null);
  const api = useMemo(() => new ApiService(), []);
  const router = useRouter();

  // Handle incoming WebSocket messages
  const handleMessage = useCallback((message: any) => {
    if ("deletedId" in message) {
      setIdeas((prev) => prev.filter((i) => i.ideaId !== message.deletedId));
      toast.success('Idea deleted');
    } else if (message.ideaId) {
      setIdeas((prev) => {
        const exists = prev.find((i) => i.ideaId === message.ideaId);
        if (exists) {
          toast.success('Idea updated');
          return prev.map((i) => (i.ideaId === message.ideaId ? message : i));
        } else {
          toast.success('New idea created');
          return [...prev, message];
        }
      });
    }
  }, []);

  // Initial fetch and WebSocket setup
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

    // Connect WebSocket
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

      // Send via WebSocket
      const success = await sendMessage(`/ideas/${projectId}/create`, inputIdea);

      if (!success) {
        throw new Error('Failed to send WebSocket message');
      }
      
      return success;
    } catch (error) {
      console.error("Error creating idea:", error);
      toast.error("Failed to create idea");
      throw error;
    }
  };

  const updateIdea = async (ideaId: string, data: Partial<Idea>) => {
    try {
      const updatePayload = {
        ideaId,
        ...data
      };
      
      const success = await sendMessage(`/ideas/${projectId}/update`, updatePayload);
      
      if (!success) {
        throw new Error('Failed to send WebSocket message');
      }
      
      return updatePayload;
    } catch (error) {
      console.error("Error updating idea:", error);
      toast.error("Failed to update idea");
      throw error;
    }
  };

  const deleteIdea = async (ideaId: string) => {
    try {
      const success = await sendMessage(`/ideas/${projectId}/delete`, { ideaId });
      
      if (!success) {
        throw new Error('Failed to send WebSocket message');
      }
      
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