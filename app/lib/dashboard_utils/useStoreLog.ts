import { useState, useEffect } from "react";
import { LogEntry } from "@/components/dashboard_Project/ChangeLog";

export function useStoreLog(projectId: string) {
    const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  
    useEffect(() => {
      fetch(`/api/projects/${projectId}/log`)
        .then((res) => res.json())
        .then((data) => setLogEntries(data))
        .catch((err) => console.error("Failed to fetch log:", err));
    }, [projectId]);
  
    const pushLog = (entry: LogEntry) => {
      setLogEntries((prev) => [...prev, entry]);
      fetch(`/api/projects/${projectId}/log`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      }).catch((err) => console.error("Failed to store log:", err));
    };
  
    return { logEntries, pushLog };
  }
  