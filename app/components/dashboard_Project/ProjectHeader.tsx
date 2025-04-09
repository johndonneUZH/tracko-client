"use client";

import { useEffect, useState, useMemo } from "react";
import { ApiService } from "@/api/apiService";

interface ProjectHeaderProps {
  projectId: string;
}

export default function ProjectHeader({ projectId }: ProjectHeaderProps) {
  const [projectName, setProjectName] = useState<string>("");

  const apiService = useMemo(() => new ApiService(), []);

  useEffect(() => {
    async function fetchProjectName() {
      try {
        const response = await apiService.get<{ projectName: string }>(`/projects/${projectId}`);
        setProjectName(response.projectName);
      } catch (error) {
        console.error("Error fetching project name:", error);
        setProjectName("Unknown Project");
      }
    }

    fetchProjectName();
  }, [projectId, apiService]);

  return (
    <h1
      style={{
        position: "fixed",
        top: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        textAlign: "center",
        marginBottom: "1rem",
        zIndex: 1000,
        background: "#eaf4fc",
        padding: "0.5rem 1rem",
        borderRadius: "8px",
      }}
    >
      {projectName ? projectName : `Project ${projectId}`}
    </h1>
  );
}
