import { LogEntry } from "@/components/dashboard_Project/ChangeLog";

export function addLogEntry(
  setLogEntries: React.Dispatch<React.SetStateAction<LogEntry[]>>,
  currentUserId: number,
  action: string,
  ideaTitle: string,
  projectId: string,
) {
  const now = new Date();
  const dateStr = now.toLocaleDateString();
  const timeStr = now.toLocaleTimeString();

  const newEntry: LogEntry = {
    projectId: parseInt(projectId),
    userId: currentUserId,
    date: dateStr,
    time: timeStr,
    action,
    ideaTitle: ideaTitle || "Untitled",
  };

  setLogEntries((prev) => [...prev, newEntry]);
}