import {LogEntry} from "@/types/logEntry";

export function addLogEntry(
  pushLog: (entry: LogEntry) => void,
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

  pushLog(newEntry);
}
