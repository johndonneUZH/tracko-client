"use client";
//Web Sockets are commented for now becasue if not the vercel app cannot be deployed

import { useParams, useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { Client } from "@stomp/stompjs";

import { useCurrentUserId } from "@/lib/commons/useCurrentUserId";

import { useComments } from "@/lib/dashboard_utils/useCommentStorage";
// import { addLogEntry } from "@/lib/dashboard_utils/logHelpers";

// Import helpers for ideas
import { isIdeaEmpty, generateNewIdea } from "@/lib/dashboard_utils/ideaHelpers";
import { useStoreLog } from "@/lib/dashboard_utils/useStoreLog";

// Import the new useIdeas hook
import { useIdeas } from "@/lib/dashboard_utils/useIdeaStorage";

import ProjectDashboard from "@/components/dashboard_Project/ProjectDashboard";
import NewIdeaButton from "@/components/dashboard_Project/NewIdeaButton";
// import ChangeLogSidebar from "@/components/dashboard_Project/ChangeLogSidebar";
import ProjectHeader from "@/components/dashboard_Project/ProjectHeader";
import IdeaModal from "@/components/dashboard_Project/IdeaModal";
import { Idea } from "@/types/idea";
import { SetStateAction } from "react";
//import WebSocketMonitor from "@/components/WebSocketMonitor";

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { id, projectId, ideaId } = useParams();
  const router = useRouter();
  const currentUserId = useCurrentUserId();
  // const { logEntries, pushLog } = useStoreLog(projectId as string);
  
  const { ideas, createIdea, updateIdea, deleteIdea } = useIdeas(projectId as string);
  
  // If useComments still requiere un updater, ajustarlo según la nueva integración.
  const { addComment, deleteComment } = useComments(() => {}, 15);
  
  // Selected idea obtained by filtering the ideas array
  const selectedIdea = ideas.find((i) => i.ideaId === (ideaId as string)) || null;
  const selectedIdeaId = selectedIdea?.ideaId || null;

  // ----------------------
  // HANDLER FUNCTIONS
  // ----------------------

  // Use generateNewIdea helper for creating a new idea.
  // Generate a new id (using crypto.randomUUID) and pass projectId and currentUserId.
  const handleCreate = async () => {
    try {
      const nextId = crypto.randomUUID();
      const newIdeaData = generateNewIdea(projectId as string, nextId, currentUserId);
      const newIdea = await createIdea(newIdeaData);
      router.push(`/users/${id}/projects/${projectId}/ideas/${newIdea.ideaId}`);
    } catch (error) {
      console.error("Error creating idea:", error); // log error creating idea
    }
  };

  const handleCancel = (idea: typeof selectedIdea) => {
    if (idea && isIdeaEmpty(idea)) {
      deleteIdea(idea.ideaId);
    }
    router.push(`/users/${id}/projects/${projectId}`);
  };
  
  const toggleVote = (ideaId: string, userId: string, type: "up" | "down") => {
    const idea = ideas.find((i) => i.ideaId === ideaId);
    if (!idea) return;
  
    let newUpVotes = [...(idea.upVotes || [])];
    let newDownVotes = [...(idea.downVotes || [])];
  
    if (type === "up") {
      if (!newUpVotes.includes(userId)) {
        newUpVotes.push(userId);
        newDownVotes = newDownVotes.filter((u) => u !== userId);
      } else {
        newUpVotes = newUpVotes.filter((u) => u !== userId);
      }
    } else {
      if (!newDownVotes.includes(userId)) {
        newDownVotes.push(userId);
        newUpVotes = newUpVotes.filter((u) => u !== userId);
      } else {
        newDownVotes = newDownVotes.filter((u) => u !== userId);
      }
    }
  
    updateIdea(ideaId, {
      ideaName: idea.ideaName,
      ideaDescription: idea.ideaDescription,
      x: idea.x,
      y: idea.y,
      upVotes: newUpVotes,
      downVotes: newDownVotes,
      comments: idea.comments, 
    });
  };
  
  

  const handleDelete = async (ideaId: string) => {
    const ideaToDelete = ideas.find((i) => i.ideaId === ideaId);
    if (!ideaToDelete) return;

    if (!isIdeaEmpty(ideaToDelete) && !window.confirm("This idea will be permanently deleted, proceed?")) return;
    
    //addLogEntry(pushLog, 20, "Deleted idea", ideaToDelete.title, projectId as string);
    await deleteIdea(ideaId);
    router.push(`/users/${id}/projects/${projectId}`);
  };

  // Adapt handleSave: use updateIdea and update properties using title and body
    const handleSave = async (ideaId: string, title: string | undefined, body: string | undefined) => {
      
      const oldIdea = ideas.find((i) => i.ideaId === ideaId);
      const oldTitle = oldIdea?.ideaName || "";
      if (!oldIdea) return;
    
      await updateIdea(ideaId, { ideaName: title, ideaDescription: body,  x: oldIdea.x, y: oldIdea.y, } );
    
      const action = oldTitle.trim() === "" ? "Created idea" : "Edited idea";
      router.push(`/users/${id}/projects/${projectId}/ideas/${ideaId}`);

    };
  
  

  // ----------------------
  // RENDER
  // ----------------------
  return (
    <>
      <div style={{ height: "100vh", padding: "2rem", background: "#eaf4fc", display: "flex" }}>
        <ProjectHeader projectId={projectId as string} />
        {/* <ChangeLogSidebar logEntries={logEntries} /> */}
        <div style={{ flex: 1, display: "flex", justifyContent: "center", gap: "2rem" }}>
        <ProjectDashboard 
          ideas={ideas}
          selectedIdeaId={selectedIdeaId}
          onIdeaClick={(ideaId) => router.push(`/users/${id}/projects/${projectId}/ideas/${ideaId}`)}
          updateIdea={updateIdea} //
          onToggleVote={toggleVote}
/>
          {children}
        </div>
        <NewIdeaButton onClick={handleCreate} />
      </div>

      {selectedIdea && (
        <IdeaModal
          idea={selectedIdea}
          canEdit={true}
          onSave={(title, body) => {
            handleSave(selectedIdea.ideaId, title, body);
            router.push(`/users/${id}/projects/${projectId}/ideas/${selectedIdea.ideaId}`);
          }}
          onDelete={() => handleDelete(selectedIdea.ideaId)}
          onCancel={() => handleCancel(selectedIdea)}
          currentUserId={currentUserId}
          onAddComment={(content, parentId) => addComment(selectedIdea.ideaId, content, parentId)}
          onDeleteComment={(commentId) => deleteComment(selectedIdea.ideaId, commentId)}
          // onLogComment={(action, title) =>
          //   //addLogEntry(pushLog, 20, action, title, projectId as string)
          // }
        />
      )}


      {/* <WebSocketMonitor 
        connected={connected} 
        messages={messages} 
        clearMessages={() => setMessages([])} 
        sendMessage={(content: string) => sendWebSocketMessage("/app/test-message", content || "Test message")} 
      /> */}
    </>
  );
}

