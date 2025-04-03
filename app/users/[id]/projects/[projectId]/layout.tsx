"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Client } from '@stomp/stompjs';

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

// TESTING WEB SOCKET
import WebSocketMonitor from '@/components/WebSocketMonitor';
import SockJS from 'sockjs-client';

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { id, projectId, ideaId } = useParams();
  const router = useRouter();
  const currentUserId = useCurrentUserId();

  // WebSocket state
  const [stompClient, setStompClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([])
  
  const { logEntries, pushLog } = useStoreLog(projectId as string);

  const {
    ideas,
    setIdeas,
    createIdea,
    saveIdea,
    deleteIdea,
    getSelectedIdea,
    storageKey,
  } = useIdeaStorage(projectId as string, currentUserId);

  const { addComment, deleteComment } = useComments(setIdeas, currentUserId);

  const selectedIdea = getSelectedIdea(ideaId as string);
  const selectedIdeaId = selectedIdea?.id || null;

  // Connect to WebSocket when component mounts
  useEffect(() => {
    if (currentUserId && projectId) {
      // Create STOMP client
      // console.log("serverUrl: ", "ws://localhost:8080/ws")
      // console.log("localStorage.getItem('token')", localStorage.getItem('token'))  
      const socket = new SockJS('http://localhost:8080/ws');

      const client = new Client({
        // Use secure WebSocket (wss://) in production
        
        // brokerURL: 'ws://localhost:8080/ws',
        webSocketFactory: () => socket,
        connectHeaders: {
          Authorization: typeof window !== 'undefined' && localStorage.getItem('token') 
            ? `Bearer ${localStorage.getItem('token')}` 
            : '',
        },
        debug: function (str) {
          console.log('STOMP: ' + str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });
  
      // Connection established handler
      client.onConnect = function(frame) {
        console.log('Connected to WebSocket:', frame);
        setConnected(true);
        
        // Subscribe to project updates
        // const subscription = client.subscribe(`/topic/projects/${projectId}/ideas`, (message) => {
        //   try {
        //     const data = JSON.parse(message.body);
        //     console.log('Received project update:', data);
        //     setMessages(prev => [...prev, data]);
            
        //     // Handle different types of updates
        //     if (data.action === 'CREATE') {
        //       // Add the new idea to the list if not already present
        //       const newIdea = data.idea;
        //       if (newIdea && !ideas.some(idea => idea.id === newIdea.id)) {
        //         setIdeas(prev => [...prev, newIdea]);
        //       }
        //     } else if (data.action === 'UPDATE') {
        //       // Update existing idea
        //       const updatedIdea = data.idea;
        //       if (updatedIdea) {
        //         setIdeas(prev => prev.map(idea => 
        //           idea.id === updatedIdea.id ? updatedIdea : idea
        //         ));
        //       }
        //     } else if (data.action === 'DELETE') {
        //       // Remove the idea from the list
        //       if (data.ideaId) {
        //         setIdeas(prev => prev.filter(idea => idea.id !== data.ideaId));
        //       }
        //     }
        //   } catch (error) {
        //     console.error('Error processing WebSocket message:', error);
        //   }
        // });

        // Inside your onConnect function, add this subscription
        const testSubscription = client.subscribe('/topic/test-responses', (message) => {
          try {
            const data = JSON.parse(message.body);
            console.log('Received test response:', data);
            setMessages(prev => [...prev, data]);
          } catch (error) {
            console.error('Error processing test message:', error);
          }
        });
      };

      // Connection error handler
      client.onStompError = function (frame) {
        console.error('STOMP error:', frame.headers['message']);
        console.error('Additional details:', frame.body);
        setConnected(false);
      };

      // Set the client in state and activate it
      setStompClient(client);
      client.activate();
      
      // Cleanup function to run on component unmount
      return () => {
        if (client && client.connected) {
          client.deactivate();
          setStompClient(null);
          setConnected(false);
        }
      };
    }
  }, [currentUserId, projectId, ideas]);

  // Function to send messages via WebSocket
  const sendWebSocketMessage = (destination, body) => {
    if (!stompClient || !connected) {
      console.error('WebSocket not connected');
      return false;
    }
    
    try {
      stompClient.publish({
        destination: destination,
        body: JSON.stringify(body)
      });
      return true;
    } catch (error) {
      console.error('Error sending WebSocket message:', error);
      return false;
    }
  };

  const handleCreate = () => {
    const newIdea = createIdea();
    router.push(`/users/${id}/projects/${projectId}/ideas/${newIdea.id}`);
  };

  const handleCreate2 = () => {
    // Send a test message via WebSocket
    const testMessage = {
      type: 'TEST_MESSAGE',
      projectId: projectId,
      userId: currentUserId,
      timestamp: new Date().toISOString(),
      content: 'This is a test WebSocket message from the frontend'
    };
    
    const success = sendWebSocketMessage(`/app/projects/${projectId}/test`, testMessage);
    
    if (success) {
      console.log('Test message sent successfully');
    } else {
      console.error('Failed to send test message');
      alert('WebSocket not connected. Please try again later.');
    }
  };

  const handleDelete = (ideaId: number) => {
    const ideaToDelete = ideas.find((i) => i.id === ideaId);
    if (!ideaToDelete) return;

    if (!isIdeaEmpty(ideaToDelete)) {
      const confirmed = window.confirm("This idea will be permanently deleted, proceed?");
      if (!confirmed) return;
    }
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

  const handleCancel = (idea: typeof selectedIdea) => {
    if (idea && isIdeaEmpty(idea)) {
      deleteIdea(idea.id);
    }
    router.push(`/users/${id}/projects/${projectId}`);
  };

  const toggleVote = (ideaId: number, userId: number, type: "up" | "down") => {
    setIdeas((prev) => toggleVoteInIdeas(prev, ideaId, userId, type));
  };

  return (
    <>
      <div
        style={{
          height: "100vh",
          padding: "2rem",
          background: "#eaf4fc",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <ProjectHeader projectId={projectId as string} />
        <ChangeLogSidebar logEntries={logEntries} />
        <div
          style={{
            display: "flex",
            flex: 1,
            justifyContent: "center",
            alignItems: "stretch",
            gap: "2rem",
          }}
        >
          <ProjectDashboard
            ideas={ideas}
            setIdeas={setIdeas}
            selectedIdeaId={selectedIdeaId}
            onIdeaClick={(ideaId) =>
              router.push(`/users/${id}/projects/${projectId}/ideas/${ideaId}`)
            }
            onToggleVote={toggleVote} 
            storageKey={storageKey}
          />
          {children}
        </div>
        <NewIdeaButton onClick={handleCreate} />
        {/* WebSocket test button */}
        <button 
            onClick={handleCreate2}
            style={{
              position: 'fixed',
              bottom: '120px',
              right: '40px',
              backgroundColor: connected ? '#4CAF50' : '#9e9e9e',
              color: 'white',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              fontSize: '24px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            }}
            title={connected ? "Send Test WebSocket Message" : "WebSocket Disconnected"}
          >
            🔌
          </button>
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

      {/* WebSocket Monitor Component */}
      <WebSocketMonitor 
        connected={connected}
        messages={messages}
        clearMessages={() => setMessages([])}
        sendMessage={(content) => sendWebSocketMessage(`/app/test-message`, content || 'Test message')}
      />
    </>
  );
}
