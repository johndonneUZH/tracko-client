import { useState, useEffect, useMemo } from "react";
import { Idea } from "@/types/idea";
import { ApiService } from "@/api/apiService";

export function useIdeas(projectId: string) {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiService = useMemo(() => new ApiService(), []);

  useEffect(() => {
    if (!projectId) return;

    async function fetchIdeas() {
      setLoading(true);
      setError(null);
      try {
        const response = await apiService.get<Idea[]>(`/projects/${projectId}/ideas`);
        console.log("Respuesta de ideas:", response);
        setIdeas(response);
      } catch (err: any) {
        console.error("Error al obtener ideas:", err);
        setError(err.message || "Error al obtener ideas.");
      } finally {
        setLoading(false);
      }
    }
    
    fetchIdeas();
  }, [projectId, apiService]);

  async function createIdea(inputIdea: Partial<Idea>) {
    try {
      const newIdea = await apiService.post<Idea>(`/projects/${projectId}/ideas`, inputIdea);
      newIdea.upVotes = newIdea.upVotes || [];
      newIdea.downVotes = newIdea.downVotes || [];
      setIdeas((prev) => [...prev, newIdea]);
      return newIdea;
    } catch (err: any) {
      console.error("Error al crear idea:", err);
      throw err;
    }
  }

  async function updateIdea(ideaId: string, updatedData: Partial<Idea>) {
    try {
      console.log("Sending update for idea", ideaId, "with data:", updatedData);
      const updatedIdea = await apiService.put<Idea>(`/projects/${projectId}/ideas/${ideaId}`, updatedData);
      console.log("Received updated idea:", updatedIdea);
      setIdeas((prev) =>
        prev.map((idea) => (idea.ideaId === ideaId ? updatedIdea : idea))
      );
      return updatedIdea;
    } catch (err: any) {
      console.error("Error al actualizar idea:", err);
      throw err;
    }
  }
  

  async function deleteIdea(ideaId: string) {
    try {
      await apiService.delete(`/projects/${projectId}/ideas/${ideaId}`);
      setIdeas((prev) => prev.filter((idea) => idea.ideaId !== ideaId));
      return true;
    } catch (err: any) {
      console.error("Error al borrar idea:", err);
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
