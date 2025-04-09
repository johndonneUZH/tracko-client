"use client";
import { useEffect, useState } from "react";

export function useCurrentUserId(): string {
  const [userId, setUserId] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const raw = sessionStorage.getItem("userId");
      if (raw) setUserId(raw);
    }
  }, []);

  return userId;
}

