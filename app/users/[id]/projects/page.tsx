"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

export default function UserProjectsPage() {
  const { id } = useParams();

  // State to hold the list of projects
  const [projects, setProjects] = useState<{ id: number; name: string }[]>([]);
  // State for the next available project ID (starts at 1)
  const [nextId, setNextId] = useState(101);
  // State for the new project name input
  const [newProjectName, setNewProjectName] = useState("");

  // Function to handle adding a new project
  const handleAddProject = () => {
    if (newProjectName.trim() === "") return; // Do not add if name is empty
    const newProject = { id: nextId, name: newProjectName.trim() };
    setProjects([...projects, newProject]);
    setNextId(nextId + 1); // Increment nextId by one
    setNewProjectName(""); // Clear the input field
  };

  return (
    <div
      style={{
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1>Projects for User {id}</h1>
      <div style={{ width: "100%", maxWidth: "600px", textAlign: "center" }}>
        {/* New project input and add button */}
        <div style={{ marginBottom: "1rem" }}>
          <input
            type="text"
            placeholder="Enter project name"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            style={{
              padding: "0.5rem",
              width: "70%",
              marginRight: "0.5rem",
            }}
          />
          <button
            onClick={handleAddProject}
            style={{
              padding: "0.5rem 1rem",
              background: "#1677ff",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Add
          </button>
        </div>
        {/* Projects list */}
        {projects.length === 0 ? (
          <p>No projects found.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {projects.map((project) => (
              <li key={project.id} style={{ margin: "1rem 0" }}>
                <Link href={`/users/${id}/projects/${project.id}`}>
                  {project.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
