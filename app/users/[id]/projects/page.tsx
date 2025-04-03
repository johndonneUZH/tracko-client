"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function UserProjectsPage() {
  const { id } = useParams();

  // State to hold the list of projects
  const [projects, setProjects] = useState<{ id: number; name: string }[]>([]);
  // State for the next available project ID (starts at 101)
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
    <div className="flex flex-col items-center p-8">
      <h1 className="text-2xl font-bold mb-4">Projects for User {id}</h1>

      <Card className="w-full max-w-md mb-6">
        <CardHeader>
          <CardTitle>Project Management</CardTitle>
          <CardDescription>Add and manage user projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter project name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="flex-1 p-2 border rounded h-10"
            />
            <Button className="h-10" onClick={handleAddProject}>
              Add
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          {projects.length === 0 ? (
            <p className="text-gray-500">No projects found.</p>
          ) : (
            <ScrollArea className="h-[200px] w-full rounded-md border p-4">
              <ul className="list-none p-0">
                {projects.map((project) => (
                  <li key={project.id} className="my-2">
                    <Link
                      href={`/users/${id}/projects/${project.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {project.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
