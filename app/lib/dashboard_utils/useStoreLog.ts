import { useState, useEffect } from "react";
import { LogEntry } from "@/components/dashboard_Project/ChangeLog";

export function useStoreLog(projectId: string) {
  const storageKey = `log-${projectId}`;

  const [logEntries, setLogEntries] = useState<LogEntry[]>(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(logEntries));
  }, [logEntries, storageKey]);

  // Listen for the localstorage event
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === storageKey && e.newValue) {
        const updatedLogs = JSON.parse(e.newValue);
        setLogEntries(updatedLogs);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [storageKey]);

  const pushLog = (entry: LogEntry) => {
    setLogEntries((prev) => [...prev, entry]);
  };

  return { logEntries, pushLog };
}
