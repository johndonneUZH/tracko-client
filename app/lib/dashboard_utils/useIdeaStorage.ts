import { useState, useEffect, useMemo, useRef } from "react";
import { Idea } from "@/types/idea";
import { ApiService } from "@/api/apiService";
import { connectWebSocket, disconnectWebSocket } from "@/lib/websocketService";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { object } from "zod";

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

    fetchIdeas();

    // Connect WebSocket
    const token = sessionStorage.getItem('token');
    const userId = sessionStorage.getItem('userId');
    if (!userId || !token) {
      setWsError("User ID or token not found");
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

    try {
      const newIdea = await apiService.post<Idea>(`/projects/${projectId}/ideas`, inputIdea);
      apiService.postChanges("ADDED_IDEA", projectId); // For analytics purpose
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
      apiService.postChanges("MODIFIED_IDEA", projectId); // For analytics purpose
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
      apiService.postChanges("CLOSED_IDEA", projectId); // For analytics purpose
      return true; 
    } catch (err: unknown) {
      toast.error("You don't have permission to delete this idea.");
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
