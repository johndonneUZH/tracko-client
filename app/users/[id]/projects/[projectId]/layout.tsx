"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

import { useCurrentUserId } from "@/lib/dashboard_utils/useCurrentUserId";
import { useIdeaStorage } from "@/lib/dashboard_utils/useIdeaStorage";
import { useComments } from "@/lib/dashboard_utils/useComments";
import { addLogEntry } from "@/lib/dashboard_utils/logHelpers";
import { isIdeaEmpty } from "@/lib/dashboard_utils/ideaHelpers";
import { toggleVoteInIdeas } from "@/lib/dashboard_utils/toggleVote";
import { useStoreLog } from "@/lib/dashboard_utils/useStoreLog";

import ProjectDashboard from "@/components/dashboard_Project/ProjectDashboard";
import NewIdeaButton from "@/components/dashboard_Project/NewIdeaButton";
import ChangeLogSidebar from "@/components/dashboard_Project/ChangeLogSidebar";
import ProjectHeader from "@/components/dashboard_Project/ProjectHeader";
import IdeaModal from "@/components/dashboard_Project/IdeaModal";
import WebSocketMonitor from "@/components/WebSocketMonitor";

export default function ProjectLayout({ children }) {
  const { id, projectId, ideaId } = useParams();
  const router = useRouter();
  const currentUserId = useCurrentUserId();
  const { logEntries, pushLog } = useStoreLog(projectId);
  
  const { ideas, setIdeas, createIdea, saveIdea, deleteIdea, getSelectedIdea, storageKey } = useIdeaStorage(projectId, currentUserId);
  const { addComment, deleteComment } = useComments(setIdeas, currentUserId);
  
  const [stompClient, setStompClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  
  const selectedIdea = getSelectedIdea(ideaId);
  const selectedIdeaId = selectedIdea?.id || null;

  useEffect(() => {
    if (!currentUserId || !projectId) return;
    
    const socket = new SockJS("http://localhost:8080/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: localStorage.getItem("token") ? `Bearer ${localStorage.getItem("token")}` : "",
      },
      debug: (str) => console.log("STOMP:", str),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = (frame) => {
      console.log("Connected to WebSocket:", frame);
      setConnected(true);
      client.subscribe("/topic/test-responses", (message) => {
        try {
          const data = JSON.parse(message.body);
          setMessages((prev) => [...prev, data]);
        } catch (error) {
          console.error("Error processing test message:", error);
        }
      });
    };

    client.onStompError = (frame) => {
      console.error("STOMP error:", frame.headers["message"], frame.body);
      setConnected(false);
    };

    setStompClient(client);
    client.activate();

    return () => {
      if (client.connected) {
        client.deactivate();
      }
      setStompClient(null);
      setConnected(false);
    };
  }, [currentUserId, projectId]);

  const sendWebSocketMessage = (destination, body) => {
    if (!stompClient || !connected) return console.error("WebSocket not connected");
    stompClient.publish({ destination, body: JSON.stringify(body) });
  };

  const handleCreate = () => {
    const newIdea = createIdea();
    router.push(`/users/${id}/projects/${projectId}/ideas/${newIdea.id}`);
  };

  const handleDelete = (ideaId) => {
    const ideaToDelete = ideas.find((i) => i.id === ideaId);
    if (!ideaToDelete) return;

    if (!isIdeaEmpty(ideaToDelete) && !window.confirm("This idea will be permanently deleted, proceed?")) return;
    
    addLogEntry(pushLog, currentUserId, "Deleted idea", ideaToDelete.title, projectId);
    deleteIdea(ideaId);
    router.push(`/users/${id}/projects/${projectId}`);
  };

  const handleSave = (id, title, body) => {
    const oldIdea = ideas.find((i) => i.id === id);
    const action = oldIdea?.title.trim() ? "Edited idea" : "Created idea";
    
    saveIdea(id, title, body);
    addLogEntry(pushLog, currentUserId, action, title || oldIdea?.title, projectId);
  };

  return (
    <>
      <div style={{ height: "100vh", padding: "2rem", background: "#eaf4fc", display: "flex" }}>
        <ProjectHeader projectId={projectId} />
        <ChangeLogSidebar logEntries={logEntries} />
        <div style={{ flex: 1, display: "flex", justifyContent: "center", gap: "2rem" }}>
          <ProjectDashboard ideas={ideas} selectedIdeaId={selectedIdeaId} onIdeaClick={(ideaId) => router.push(`/users/${id}/projects/${projectId}/ideas/${ideaId}`)} onToggleVote={(ideaId, userId, type) => setIdeas(toggleVoteInIdeas(ideas, ideaId, userId, type))} storageKey={storageKey} />
          {children}
        </div>
        <NewIdeaButton onClick={handleCreate} />
      </div>

      {selectedIdea && (
        <IdeaModal idea={selectedIdea} canEdit={selectedIdea.creatorId === currentUserId} onSave={(title, body) => handleSave(selectedIdea.id, title, body)} onDelete={() => handleDelete(selectedIdea.id)} onCancel={() => router.push(`/users/${id}/projects/${projectId}`)} currentUserId={currentUserId} onAddComment={(content, parentId) => addComment(selectedIdea.id, content, parentId)} onDeleteComment={(commentId) => deleteComment(selectedIdea.id, commentId)} onLogComment={(action, title) => addLogEntry(pushLog, currentUserId, action, title, projectId)} />
      )}

      <WebSocketMonitor connected={connected} messages={messages} clearMessages={() => setMessages([])} sendMessage={(content) => sendWebSocketMessage("/app/test-message", content || "Test message")} />
    </>
  );
}
