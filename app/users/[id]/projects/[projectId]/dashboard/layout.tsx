"use client";
// Web Sockets are commented for now because if not the vercel app cannot be deployed
import { RealtimeCursors } from '@/components/cursor/realtime-cursors'
import { useParams, useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { Client } from "@stomp/stompjs";

import { useCurrentUserId } from "@/lib/commons/useCurrentUserId";

import { useComments } from "@/lib/dashboard_utils/useCommentStorage";
// import { addLogEntry } from "@/lib/dashboard_utils/logHelpers";

// Import helpers for ideas
import { isIdeaEmpty } from "@/lib/dashboard_utils/ideaHelpers";

// Import the new useIdeas hook
import { useIdeas } from "@/lib/dashboard_utils/useIdeaStorage";

import ProjectDashboard from "@/components/dashboard_Project/ProjectDashboard";
import NewIdeaButton from "@/components/dashboard_Project/NewIdeaButton";
// import ChangeLogSidebar from "@/components/dashboard_Project/ChangeLogSidebar"
import IdeaModal from "@/components/dashboard_Project/IdeaModal";
import { useEffect, useState, useMemo } from "react";
import { ApiService } from "@/api/apiService";
import { useProject } from '@/hooks/useProject'
import { NewProject } from "@/components/commons/NewProject";


import { useCommentFetcher } from "@/lib/dashboard_utils/useCommentFetcher";
//import WebSocketMonitor from "@/components/WebSocketMonitor";

import { SidebarProvider } from "@/components/sidebar/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarTrigger } from "@/components/sidebar/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/commons/breadcrumb";
import { User } from '@/types/user';

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { id, projectId, ideaId } = useParams();
  const router = useRouter();
  const currentUserId = useCurrentUserId();
  const { projectId: currentProjectId } = useProject()
  // const { logEntries, pushLog } = useStoreLog(projectId as string);
  
  const { ideas, createIdea, updateIdea, deleteIdea } = useIdeas(projectId as string);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const fetchedUser = await apiService.getUser<User>(id as string);
        setUser(fetchedUser);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    }
    fetchUser();
  }, [user]);

  // Selected idea obtained by filtering the ideas array
  const selectedIdea = ideas.find((i) => i.ideaId === (ideaId as string)) || null;
  const selectedIdeaId = selectedIdea?.ideaId || null;
  const { addComment, deleteComment } = useComments(projectId as string, selectedIdeaId || "");

  const { commentMap, refreshComments } = useCommentFetcher(projectId as string, selectedIdeaId || "");

  // ----------------------
  // HANDLER FUNCTIONS
  // ----------------------

  // Use generateNewIdea helper for creating a new idea.
  // Generate a new id (using crypto.randomUUID) and pass projectId and currentUserId.
  const handleCreate = async (title: string, body: string | null) => {
    try {
      const newIdea = await createIdea(title, body);
      router.push(`/users/${id}/projects/${projectId}/dashboard/ideas/${newIdea.ideaId}`);
    } catch (error) {
      console.error("Error creating idea:", error);
    }
  };

  const handleCancel = (idea: typeof selectedIdea) => {
    if (idea && isIdeaEmpty(idea)) {
      deleteIdea(idea.ideaId);
    }
    router.push(`/users/${id}/projects/${projectId}/dashboard`);
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
      upVotes: newUpVotes,
      downVotes: newDownVotes,
    });
  };

  const handleDelete = async (ideaId: string) => {
    const ideaToDelete = ideas.find((i) => i.ideaId === ideaId);
    if (!ideaToDelete) return;

    if (!isIdeaEmpty(ideaToDelete) && !window.confirm("This idea will be permanently deleted, proceed?")) return;
    
    // addLogEntry(pushLog, 20, "Deleted idea", ideaToDelete.title, projectId as string);
    await deleteIdea(ideaId);
    router.push(`/users/${id}/projects/${projectId}/dashboard`);
  };

  // Adapt handleSave: use updateIdea and update properties using title and body
      const handleSave = async (ideaId: string, title: string, body: string) => {
      
      const oldIdea = ideas.find((i) => i.ideaId === ideaId);
      //const oldTitle = oldIdea?.ideaName || "";
      if (!oldIdea) return;
    
      await updateIdea(ideaId, { ideaName: title, ideaDescription: body,  x: oldIdea.x, y: oldIdea.y, } );
    
     // const action = oldTitle.trim() === "" ? "Created idea" : "Edited idea";
      router.push(`/users/${id}/projects/${projectId}/dashboard/ideas/${ideaId}`);

    };

    const [projectName, setProjectName] = useState<string>("");

    const apiService = useMemo(() => new ApiService(), []);

    useEffect(() => {
      async function fetchProjectName() {
        try {
          const response = await apiService.get<{ projectName: string }>(`/projects/${projectId}`);
          setProjectName(response.projectName);
        } catch (error) {
          console.error("Error fetching project name:", error);
          setProjectName("Unknown Project");
        }
      }

      fetchProjectName();
    }, [projectId, apiService]);
  
  

  // ----------------------
  // RENDER
  // ----------------------
  return (
    <>
    <SidebarProvider>
      <div className="flex h-screen w-full mt-4 mb-4">
        <AppSidebar className="w-64 shrink-0" />
        <div className="flex flex-col flex-1">
          <header className="flex h-16 items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1 mr-2" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          { !currentProjectId ? <NewProject/> :
          <div className="flex flex-col flex-1 p-4">
              <div className="flex justify-between mb-10">
                <h1 className="text-xl font-bold">Dashboard Project {projectName}</h1>
                <NewIdeaButton onClick={handleCreate} />
              </div>
            <ProjectDashboard 
              ideas={ideas}
              selectedIdeaId={selectedIdeaId}
              onIdeaClick={(ideaId) => router.push(`/users/${id}/projects/${projectId}/dashboard/ideas/${ideaId}`)}
              updateIdea={updateIdea} //
              onToggleVote={toggleVote}
            />
              {children}            

            {selectedIdea && (
              <IdeaModal
              idea={selectedIdea}
              canEdit={true}
              onSave={(title, body) => {
                handleSave(selectedIdea.ideaId, title, body);
                router.push(`/users/${id}/projects/${projectId}/dashboard/ideas/${selectedIdea.ideaId}`);
              }}
              onDelete={() => handleDelete(selectedIdea.ideaId)}
              onCancel={() => handleCancel(selectedIdea)}
              currentUserId={currentUserId}
              onAddComment={async (content, parentId) => {
                const newComment = await addComment(content, parentId);
                if (newComment && !parentId) {
                  await updateIdea(selectedIdea.ideaId, {
                    comments: [...(selectedIdea.comments || []), newComment.commentId],
                  });
                }
                await refreshComments();
                }} 
              onDeleteComment={(commentId) => deleteComment(commentId)}
              commentMap={commentMap}
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
          </div>
          }
        </div>
      </div>
    </SidebarProvider>
    <div className="w-full min-h-screen">
    <RealtimeCursors roomName="Dashboard" username={user?.username != null ? user.username : "Hidden user"} />
    </div>
  </>
  );
}