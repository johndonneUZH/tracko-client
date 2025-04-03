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

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { id, projectId, ideaId } = useParams();
  const router = useRouter();
  const currentUserId = useCurrentUserId();
  const { logEntries, pushLog } = useStoreLog(projectId as string);
  
  const { ideas, setIdeas, createIdea, saveIdea, deleteIdea, getSelectedIdea, storageKey } = useIdeaStorage(projectId as string, currentUserId);
  const { addComment, deleteComment } = useComments(setIdeas, currentUserId);
  
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [connected, setConnected] = useState(false);

  type MessageType = {
    type: string;
    content: string;
    timestamp: number;
  };
  
  const [messages, setMessages] = useState<MessageType[]>([]);
  // const [messages, setMessages] = useState<any[]>([]);
  
  const selectedIdea = getSelectedIdea(ideaId as string);
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

  const sendWebSocketMessage = (destination: string, body: string) => {
    if (!stompClient || !connected) return console.error("WebSocket not connected");
    stompClient.publish({ destination, body: JSON.stringify(body) });
  };

  const handleCreate = () => {
    const newIdea = createIdea();
    router.push(`/users/${id}/projects/${projectId}/ideas/${newIdea.id}`);
  };

  const handleCancel = (idea: typeof selectedIdea) => {
    if (idea && isIdeaEmpty(idea)) {
      deleteIdea(idea.id);
    }
    router.push(`/users/${id}/projects/${projectId}`);
  };

  const toggleVote = (ideaId: number, userId: number, type: "up" | "down") => {
    setIdeas((prev) => toggleVoteInIdeas(prev, ideaId, userId, type));
  };

  const handleDelete = (ideaId: number) => {
    const ideaToDelete = ideas.find((i) => i.id === ideaId);
    if (!ideaToDelete) return;

    if (!isIdeaEmpty(ideaToDelete) && !window.confirm("This idea will be permanently deleted, proceed?")) return;
    
    addLogEntry(pushLog, currentUserId, "Deleted idea", ideaToDelete.title, projectId as string);
    deleteIdea(ideaId);
    router.push(`/users/${id}/projects/${projectId}`);
  };

  const handleSave = (id: number, title: string, body: string) => {
    const oldIdea = ideas.find((i) => i.id === id);
    const oldTitle = oldIdea?.title || "";

    saveIdea(id, title, body);

    const action = oldTitle.trim() === "" ? "Created idea" : "Edited idea";
    addLogEntry(pushLog, currentUserId, action, title || oldTitle, projectId as string);

  };

  return (
    <>
      <div style={{ height: "100vh", padding: "2rem", background: "#eaf4fc", display: "flex" }}>
        <ProjectHeader projectId={projectId as string} />
        <ChangeLogSidebar logEntries={logEntries} />
        <div style={{ flex: 1, display: "flex", justifyContent: "center", gap: "2rem" }}>
          <ProjectDashboard 
            ideas={ideas} 
            setIdeas={setIdeas}
            selectedIdeaId={selectedIdeaId} 
            onIdeaClick={(ideaId) => router.push(`/users/${id}/projects/${projectId}/ideas/${ideaId}`)} 
            onToggleVote={toggleVote} 
            storageKey={storageKey} />
          {children}
        </div>
        <NewIdeaButton onClick={handleCreate} />
      </div>

      {selectedIdea && (
        <IdeaModal
          idea={selectedIdea}
          canEdit={selectedIdea.creatorId === currentUserId}
          onSave={(title, body) => {
            handleSave(selectedIdea.id, title, body);
            router.push(`/users/${id}/projects/${projectId}/ideas/${selectedIdea.id}`);
          }}
          onDelete={() => handleDelete(selectedIdea.id)}
          onCancel={() => handleCancel(selectedIdea)}
          currentUserId={currentUserId}
          onAddComment={(content, parentId) => addComment(selectedIdea.id, content, parentId)}
          onDeleteComment={(commentId) => deleteComment(selectedIdea.id, commentId)}
          onLogComment={(action, title) =>
            addLogEntry(pushLog, currentUserId, action, title, projectId as string)
          }
        />
      )}

      <WebSocketMonitor 
        connected={connected} 
        messages={messages} 
        clearMessages={() => setMessages([])} 
        sendMessage={(content: string) => sendWebSocketMessage("/app/test-message", content || "Test message")} 
      />
    </>
  );
}
