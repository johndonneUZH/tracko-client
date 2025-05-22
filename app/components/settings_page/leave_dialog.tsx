/* eslint-disable */

"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/commons/button";
import { UserMinus } from "lucide-react";
import { useRouter } from "next/navigation";
import { ApiService } from "@/api/apiService";
import { useUserProjects } from "@/lib/browser_utils/useProjectStorage";

export function LeaveDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);
  const router = useRouter();
  const apiService = new ApiService();

  useEffect(() => {
    const storedUserId = sessionStorage.getItem("userId");
    const storedProjectId = sessionStorage.getItem("projectId");
    if (!storedUserId) {
      router.push("/login");
    } else {
      setUserId(storedUserId);
      setProjectId(storedProjectId);
    }
  }, [router]);

  const { leaveProject } = useUserProjects(userId || "");

  if (!userId) return null; // Optional: show nothing until sessionStorage is available

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <UserMinus />
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
          <Button
            variant="destructive"
            disabled={loading}
            onClick={async () => {
              if (!projectId) {
                console.error("Project ID not found in session storage.");
                return;
              }
              setLoading(true);
              const success = await leaveProject(projectId);
              setLoading(false);
              if (success) {
                setOpen(false);
                router.push(`/users/${userId}`);
              }
            }}
          >
            Leave Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
