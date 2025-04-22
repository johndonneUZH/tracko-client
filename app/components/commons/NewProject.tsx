"use client";

import React from "react";
import { Button } from "@/components/commons/button";
import { useRouter } from "next/navigation";
import { CirclePlus } from "lucide-react"
import { useEffect, useState } from "react";

export const NewProject = () => {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>("");

  useEffect(() => {
    const sessionUserId = sessionStorage.getItem("userId")
    if (sessionUserId) {
      setUserId(sessionUserId)
    } else {
      router.push("/login")
    }
  }, [router])

  const handleCreateProject = () => {
    router.push(`/users/${userId}/projects`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
      <h2 className="text-xl font-semibold text-muted-foreground">
        You don&apos;t have any projects yet
      </h2>
      <Button onClick={handleCreateProject} className="">
        <CirclePlus/> Create New Project
      </Button>
    </div>
  );
};