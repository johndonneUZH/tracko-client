"use client";

import { useState, useEffect } from "react";
import { Project } from "./type";

// Custom hook for managing user projects with local storage.
export function useUserProjects(userId: string) {
  const storageKey = `userProjects_${userId}`;

  // Lazy initialization of projects from local storage.
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = typeof window !== "undefined" 
      ? localStorage.getItem(storageKey) 
      : null;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.projects || [];
      } catch (error) {
        console.error("Error parsing stored projects", error);
      }
    }
    return [];
  });

  // Lazy initialization of nextId from local storage.
  const [nextId, setNextId] = useState<number>(() => {
    const saved = typeof window !== "undefined"
      ? localStorage.getItem(storageKey)
      : null;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.nextId || 101;
      } catch (error) {
        console.error("Error parsing stored nextId", error);
      }
    }
    return 101;
  });

  // Sync with local storage whenever `projects` or `nextId` changes.
  useEffect(() => {
    const dataToSave = { projects, nextId };
    localStorage.setItem(storageKey, JSON.stringify(dataToSave));
  }, [projects, nextId, storageKey]);

  // Listen for external changes to the same local storage key (e.g., in other tabs).
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === storageKey && e.newValue) {
        try {
          const updatedData = JSON.parse(e.newValue);
          setProjects(updatedData.projects || []);
          setNextId(updatedData.nextId || 101);
        } catch (error) {
          console.error("Error parsing storage event data", error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [storageKey]);

  // Add a new project.
  function addProject(projectName: string) {
    if (projectName.trim() === "") return;
    const newProject: Project = {
      id: nextId,
      name: projectName.trim(),
      lastModified: new Date().toISOString(),
    };
    setProjects((prev) => [...prev, newProject]);
    setNextId((prev) => prev + 1);
  }

  // Delete an array of projects.
  function deleteProjects(projectIds: number[]) {
    setProjects((prev) =>
      prev.filter((proj) => !projectIds.includes(proj.id))
    );
  }

  return {
    projects,
    setProjects,
    nextId,
    setNextId,
    addProject,
    deleteProjects,
  };
}
