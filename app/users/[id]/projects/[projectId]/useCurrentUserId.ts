"use client";
import { useEffect, useState } from "react";

export function useCurrentUserId(): number {
  const [userId, setUserId] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const raw = sessionStorage.getItem("currentUserId");
      if (raw) setUserId(parseInt(raw, 10));
    }
  }, []);

  return userId;
}
