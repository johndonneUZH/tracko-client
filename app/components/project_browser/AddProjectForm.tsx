"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/project_browser/dialog";
import { Button } from "@/components/commons/button";
import { Input } from "@/components/commons/input";
import { CirclePlus } from "lucide-react";

interface AddProjectFormProps {
  onAddProject: (projectName: string, projectDescription: string) => void;
}

export function AddProjectForm({ onAddProject }: AddProjectFormProps) {
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  // Handle adding a new project
  const handleAddProject = () => {
    const trimmedName = newProjectName.trim();
    const trimmedDescription = newProjectDescription.trim();
    if (trimmedDescription.length > 100) {
      setError("Project description cannot exceed 100 characters.");
      return;
    }
    else if (!trimmedDescription) {
      setError("Project description cannot be empty.");
      return;
    }
    else if (!trimmedName) {
      setError("Project name cannot be empty.");
      return;
    }
    setError("");
    onAddProject(trimmedName, trimmedDescription);
    setNewProjectName("");
    setNewProjectDescription("");
    setDialogOpen(false);
  };

  // Handle Enter key press in input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddProject();
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button className="h-10 flex items-center gap-2">
          <CirclePlus className="w-5 h-5" />
          Create Project
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>Please enter the name of the project.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Enter project name"
            value={newProjectName}
            onChange={(e) => {
              setNewProjectName(e.target.value);
              setError("");
            }}
            onKeyDown={handleKeyDown}
            className="w-full"
          />

          <Input
            placeholder="Enter project description"
            value={newProjectDescription}
            onChange={(e) => {
              setNewProjectDescription(e.target.value);
              setError("");
            }}
            onKeyDown={handleKeyDown}
            className="w-full"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddProject}>Add</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
