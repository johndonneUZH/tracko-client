"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

// If you want to use the shadcn <Input />, import it. 
// Or you can just use a regular <input /> as well.
import { Input } from "@/components/ui/input";

interface AddProjectFormProps {
  onAddProject: (projectName: string) => void;
}

export function AddProjectForm({ onAddProject }: AddProjectFormProps) {
  const [newProjectName, setNewProjectName] = useState("");

  // Handle pressing Enter key in the input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddProject();
    }
  };

  function handleAddProject() {
    onAddProject(newProjectName);
    setNewProjectName("");
  }

  return (
    <div className="flex gap-2">
      <Input
        type="text"
        placeholder="Enter project name"
        value={newProjectName}
        onChange={(e) => setNewProjectName(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1"
      />
      <Button onClick={handleAddProject}>Add</Button>
    </div>
  );
}
