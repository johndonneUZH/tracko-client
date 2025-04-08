"use client";

import { useState, useEffect, use, useMemo } from "react";
import { Project } from "../../types/project";
import { ApiService } from "@/api/apiService";

export function useUserProjects(userId: string) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Memoize the apiService to prevent recreation on every render
  const apiService = useMemo(() => new ApiService(), []);

  useEffect(() => {
    if (!userId) return; 

    let isMounted = true;

    async function fetchProjects() {
      setLoading(true);
      setError(null);
      try {
        const response = await apiService.get(`/users/${userId}/projects`) as { data: Project[] };
        console.log("API Response:", response);
        const transformedProjects = response.map(proj => ({
          id: proj.projectId,
          name: proj.projectName,
          projectDescription: proj.projectDescription,
          projectMembers: proj.projectMembers || [],
          ownerId: proj.ownerId,
          createdAt: new Date(proj.createdAt),
          updatedAt: new Date(proj.updatedAt)
        })) as Project[];
        
        setProjects(transformedProjects);
      } catch (err: any) {
        console.error("Failed to fetch projects:", err);
        setError("Failed to fetch projects.");
      } finally {
        setLoading(false);
      }
    }
    
    fetchProjects();

    return () => {
      isMounted = false; // Cleanup function
    };
  }, [userId, apiService]); 


  // Add project via API
  async function addProject(name: string, description: string) {
    const trimmedName = name.trim();
    const trimmedDescription = description.trim();
    if (trimmedName.trim() === "") return;
  
    try {
      const response = await apiService.post(`/projects`, {
        projectName: trimmedName,
        projectDescription: trimmedDescription 
      }) as Project ;
      
      // Transform the added project to match our type
      const newProject = {
        id: response.projectId,
        name: response.projectName,
        projectDescription: response.projectDescription,
        projectMembers: response.projectMembers || [],
        ownerId: response.ownerId,
        createdAt: new Date(response.createdAt),
        updatedAt: new Date(response.updatedAt)
      };
      
      setProjects(prev => [...prev, newProject]);
    } catch (err) {
      console.error("Failed to add project:", err);
    }
  }

  // Optional: Delete projects via API
  async function deleteProjects(projectIds: string[]) {
    try {
      await Promise.all(
        projectIds.map((id) =>
          apiService.delete(`/projects/${id}`)
        )
      );
      setProjects((prev) => prev.filter((proj) => !projectIds.includes(proj.id)));
    } catch (err) {
      console.error("Failed to delete projects:", err);
    }
  }

  return {
    projects,
    loading,
    error,
    addProject,
    deleteProjects,
  };

}
