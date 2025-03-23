"use client";

import { useParams } from "next/navigation";
import Link from "next/link";

export default function UserProjectsPage() {
  const { id } = useParams();

  // Temporary mock data
  const mockProjects = [
    { id: 101, name: "Project one" },
    { id: 102, name: "Project two" },
  ];

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Projects for User {id}</h1>
      <ul>
        {mockProjects.map((project) => (
          <li key={project.id}>
            <Link href={`/users/${id}/projects/${project.id}`}>
              {project.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
