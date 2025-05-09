/* eslint-disable */

"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/commons/button";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ApiService } from "@/api/apiService";
import { useUserProjects } from "@/lib/browser_utils/useProjectStorage";

export function DeleteDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const apiService = new ApiService();
  const userId = sessionStorage.getItem("userId") || "";
  if (!userId) {
    router.push("/login");
  }
  const { deleteProject } = useUserProjects(userId);
  const projectId = sessionStorage.getItem("projectId") || "";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <Trash2/>
          Delete Project
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete this project?</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-600">
          This action cannot be undone. This will permanently delete the project and remove all associated data.
        </p>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button variant="destructive" disabled={loading} 
            onClick={async () => {
              setLoading(true);
              const success = await deleteProject(projectId);
              setLoading(false);
              if (success) {
                setOpen(false);
                router.push(`/users/${userId}`); 
              }
          }}>
            Delete Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
