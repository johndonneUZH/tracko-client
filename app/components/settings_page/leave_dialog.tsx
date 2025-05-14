/* eslint-disable */

"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/commons/button";
import { UserMinus } from "lucide-react";
import { useRouter } from "next/navigation";
import { ApiService } from "@/api/apiService";
import { useUserProjects } from "@/lib/browser_utils/useProjectStorage";

export function LeaveDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const apiService = new ApiService();
  const userId = sessionStorage.getItem("userId") || "";
  if (!userId) {
    router.push("/login");
  }
  const { leaveProject } = useUserProjects(userId);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <UserMinus/>
          <span className="hidden md:inline">Leave Project</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Leave this project?</DialogTitle>
        </DialogHeader>
        <DialogDescription>
            Are you sure you want to leave this project? You won't have access to it anymore.
        </DialogDescription>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button variant="destructive" disabled={loading} 
            onClick={async () => {
              setLoading(true);
              const projectId = sessionStorage.getItem("projectId") || "";
                if (!projectId) {
                    console.error("Project ID not found in session storage.");
                    return;
                }
              const success = await leaveProject(projectId);
              setLoading(false);
              if (success) {
                setOpen(false);
                router.push(`/users/${userId}`); 
              }
          }}>
            Leave Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
