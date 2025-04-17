/* eslint-disable */
"use client";

import { useState, useEffect, useMemo } from "react";
import { Project } from "../../types/project";
import { ApiService } from "@/api/apiService";
import { useRouter } from "next/navigation";
import { toast } from "sonner";   

export function useUserProjects(userId: string) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Memoize the apiService to prevent recreation on every render
  const apiService = useMemo(() => new ApiService(), []);
  const router = useRouter(); 

  useEffect(() => {
    if (!userId) return; 

    async function fetchProjects() {
      setLoading(true);
      setError(null);
      try {
        // Remove the type assertion and let TypeScript infer the type
        const response = await apiService.get<Project[]>(`/users/${userId}/projects`);
        console.log("API Response:", response);
        
        setProjects(response);
      } catch (err: any) {
        console.error("Failed to fetch projects:", err);
        setError(err.message || "Failed to fetch projects.");
      } finally {
        setLoading(false);
      }
    }
    
    fetchProjects();
  }, [userId, apiService]); // Add projects.length to dependencies


  // Add project via API
  async function addProject(name: string, description: string) {
    const trimmedName = name.trim();
    const trimmedDescription = description.trim();
    if (trimmedName.trim() === "") return;
  
    try {
      const response = await apiService.post<Project>(`/projects`, {
        projectName: trimmedName,
        projectDescription: trimmedDescription 
      }) as Project ;
      setProjects([...projects, response]);
      sessionStorage.setItem("projectId", response.projectId); // Store the new project ID in session storage
      console.log("Pushing to:", `/users/${userId}/projects/${response.projectId}/settings`);
      router.push(`/users/${userId}/projects/${response.projectId}/settings`);
    } catch (err) {
      console.error("Failed to add project:", err);
    }
  }

  // Optional: Delete projects via API
  async function deleteProject(projectId: string) {
    try {
      // Delete projects in sequence (better error handling than Promise.all)
      await apiService.delete(`/projects/${projectId}`);
      setProjects((prevProjects) => prevProjects.filter(project => project.projectId !== projectId));
      return true; // Indicate success
    } catch (err) {
      console.error('Deletion failed:', err);
      return false; // Indicate failure
    }
  }

  async function addFriends(friends: string[]): Promise<void> {
    const projectId = sessionStorage.getItem("projectId") || "";
    if (!projectId) {
      toast.error("No project selected.");
      return;
    }
    if (friends.length === 0) {
      toast.error("No friends selected.");
      return;
    }
    try {
      await apiService.addFriendsToProject(projectId, friends);
    } catch (err) {
      console.error("Failed to add friends:", err);
    }
  }

  return {
    projects,
    loading,
    error,
    addProject,
    deleteProject,
    addFriends,
  };

}
