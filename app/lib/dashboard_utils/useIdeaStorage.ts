import { useState, useEffect, useMemo, useRef } from "react";
import { Idea } from "@/types/idea";
import { ApiService } from "@/api/apiService";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export function useIdeas(projectId: string) {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiService = useMemo(() => new ApiService(), []);
  const stompClientRef = useRef<Client | null>(null);

  // Fetch inicial
  useEffect(() => {
    if (!projectId) return;

    async function fetchIdeas() {
      setLoading(true);
      setError(null);
      try {
        const response = await apiService.get<Idea[]>(`/projects/${projectId}/ideas`);
        setIdeas(response);
      } catch (err: unknown) {
        console.error("Error fetching ideas:", err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to fetch ideas.");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchIdeas();
  }, [projectId, apiService]);

  // WebSocket 
  useEffect(() => {
    if (!projectId) return;

    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"; //for development only
    const socket = new SockJS(`${baseUrl}/ws`);
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        client.subscribe(`/topic/ideas/${projectId}`, (message) => {
          const idea = JSON.parse(message.body);
          if ("deletedId" in idea) {
            setIdeas((prev) => prev.filter((i) => i.ideaId !== idea.deletedId));
          } else {
            setIdeas((prev) => {
              const exists = prev.find((i) => i.ideaId === idea.ideaId);
              if (exists) {
                return prev.map((i) => (i.ideaId === idea.ideaId ? idea : i));
              } else {
                return [...prev, idea];
              }
            });
          }
        });
      },
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [projectId]);

  async function createIdea(title: string, body: string | null) {
    const inputIdea = {
      ideaName: title,
      ideaDescription: body ? body : ""
    };

    try {
      const newIdea = await apiService.post<Idea>(`/projects/${projectId}/ideas`, inputIdea);
      return newIdea; 
    } catch (err: unknown) {
      console.error("Error creating idea:", err);
      if (err instanceof Error) {
        throw err;
      } else {
        throw new Error("Unknown error occurred while creating idea.");
      }
    }
  }

  async function updateIdea(ideaId: string, updatedData: Partial<Idea>) {
    try {
      const updatedIdea = await apiService.put<Idea>(`/projects/${projectId}/ideas/${ideaId}`, updatedData);
      return updatedIdea;
    } catch (err: unknown) {
      console.error("Error updating idea:", err);
      if (err instanceof Error) {
        throw err;
      } else {
        throw new Error("Unknown error occurred while updating idea.");
      }
    }
  }

  async function deleteIdea(ideaId: string) {
    try {
      await apiService.delete(`/projects/${projectId}/ideas/${ideaId}`);
      return true; 
    } catch (err: unknown) {
      console.error("Error deleting idea:", err);
      return false;
    }
  }

  return {
    ideas,
    loading,
    error,
    createIdea,
    updateIdea,
    deleteIdea,
  };
}
