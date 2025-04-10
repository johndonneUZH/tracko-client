"use client";

import ChangeLog from "./ChangeLog";
import { LogEntry } from "@/types/logEntry";

export default function ChangeLogSidebar({ logEntries }: { logEntries: LogEntry[] }) {
  return (
    <div
      style={{
        background: "#f1f1f1",
        borderLeft: "2px dashed #ccc",
        overflow: "auto",
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      }}
    >
      <ChangeLog logEntries={logEntries} />
    </div>
  );
}
