/* eslint-disable */
"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { RealtimeCursors } from '@/components/magicui/realtime-cursors';
import { RealtimeChat } from '@/components/magicui/realtime-chat';
import { useParams, useRouter } from "next/navigation";
import { useCurrentUserId } from "@/lib/commons/useCurrentUserId";
import { useComments } from "@/lib/dashboard_utils/useCommentStorage";
import { isIdeaEmpty } from "@/lib/dashboard_utils/ideaHelpers";
import { useIdeas } from "@/lib/dashboard_utils/useIdeaStorage";
import ProjectDashboard from "@/components/dashboard_Project/ProjectDashboard";
import NewIdeaButton from "@/components/dashboard_Project/NewIdeaButton";
import AiIdeaButton from "@/components/dashboard_Project/AIIdeabutton";
import { AiDialog } from "@/components/dashboard_Project/AIDialog";
import { DynamicIcon } from 'lucide-react/dynamic';

import IdeaModal from "@/components/dashboard_Project/IdeaModal";
import { useEffect, useState, useMemo } from "react";
import { ApiService } from "@/api/apiService";
import { useProject } from '@/hooks/useProject'
import { NewProject } from "@/components/commons/NewProject";
import { useCommentFetcher } from "@/lib/dashboard_utils/useCommentFetcher";
import { Sidebar, SidebarContent, SidebarProvider } from "@/components/sidebar/sidebar";
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
import NewReport from "@/components/dashboard_Project/NewReport";

interface ProjectData {
  projectName: string;
  projectDescription: string;
  projectMembers: string[];
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  projectLogoUrl: string;
}

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { id, projectId, ideaId } = useParams();
  const router = useRouter();
  const currentUserId = useCurrentUserId();
  const { projectId: currentProjectId } = useProject();
  const [roomName, setRoomName] = useState<string>("Dashboard");
  const { ideas, createIdea, updateIdea, deleteIdea } = useIdeas(projectId as string);
  const [user, setUser] = useState<User | null>(null);
  const [hasMounted, setHasMounted] = useState(false);
  const [isRightSidebarCollapsed, setIsRightSidebarCollapsed] = useState(false);
  const [projectName, setProjectName] = useState<string>("");
  const [members, setMembers] = useState<User[]>([]);
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const iconName = (projectData?.projectLogoUrl.toLowerCase() || "university") as any

  const apiService = useMemo(() => new ApiService(), []);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("projectId");
      if (stored) setRoomName(stored);
    }
  }, []);

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
  }, [id, apiService]);

  useEffect(() => {
    const fetchProjectData = async () => {
      const projectId = sessionStorage.getItem("projectId");
      const token = sessionStorage.getItem("token");
  
      if (!projectId || !token) {
        router.push("/login");
        return;
      }
  
      try {
        const data = await apiService.get<ProjectData>(`/projects/${projectId}`)
        setProjectData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
  
    fetchProjectData();
  }, [currentProjectId]);

  useEffect(() => {
    const fetchMembersData = async () => {
      const projectId = sessionStorage.getItem("projectId");
      const token = sessionStorage.getItem("token");

      if (!projectId || !token) {
        router.push("/login");
        return;
      }

      try {
        const data = await apiService.get<User[]>(`/projects/${projectId}/members`)
        setMembers(data);
        console.log("Members data:", data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchMembersData();
  }, []); 

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

  // Selected idea obtained by filtering the ideas array
  const selectedIdea = ideas.find((i) => i.ideaId === (ideaId as string)) || null;
  const selectedIdeaId = selectedIdea?.ideaId || null;
  const { addComment, deleteComment } = useComments(projectId as string, selectedIdeaId || "");

  const { commentMap, refreshComments } = useCommentFetcher(projectId as string, selectedIdeaId || "");

  // ----------------------
  // HANDLER FUNCTIONS
  // ----------------------

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
    
    await deleteIdea(ideaId);
    router.push(`/users/${id}/projects/${projectId}/dashboard`);
  };

  const handleSave = async (ideaId: string, title: string, body: string) => {
    const oldIdea = ideas.find((i) => i.ideaId === ideaId);
    if (!oldIdea) return;
  
    await updateIdea(ideaId, { 
      ideaName: title, 
      ideaDescription: body,  
      x: oldIdea.x, 
      y: oldIdea.y, 
    });
    
    router.push(`/users/${id}/projects/${projectId}/dashboard/ideas/${ideaId}`);
  };

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
            
              <div className="flex flex-col flex-1 p-4">
                <div className="flex flex-col items-center mb-10 space-y-4">
                  <div className="flex space-x-4 items-center">
                    <div className="flex aspect-square items-center justify-center rounded-lg text-sidebar-primary-foreground">
                      <DynamicIcon className="h-16 w-16 rounded-lg bg-primary p-2" name={iconName}/>
                    </div>
                    <div>
                      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                        {projectData?.projectName || "Loading..."}
                      </h3>
                      <p className="leading-7">
                        {projectData?.projectDescription}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <NewReport projectId={sessionStorage.getItem("projectId") || ""} />
                    <NewIdeaButton onClick={handleCreate} />
                    <AiDialog ideas={ideas} createIdea={createIdea} updateIdea={updateIdea} />
                  </div>
                </div>
                
                <ProjectDashboard 
                  ideas={ideas}
                  selectedIdeaId={selectedIdeaId}
                  onIdeaClick={(ideaId) => router.push(`/users/${id}/projects/${projectId}/dashboard/ideas/${ideaId}`)}
                  updateIdea={updateIdea}
                  onToggleVote={toggleVote}
                  members={members}
                />
                
                <RealtimeCursors 
                  roomName={roomName} 
                  username={user?.username ?? "Unknown user"} 
                />
                {children}            

                {selectedIdea && (
                  <IdeaModal
                    idea={selectedIdea}
                    canEdit={true}
                    onSave={(title, body) => { handleSave(selectedIdea.ideaId, title, body) }}
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
                    members={members}
                  />
                )}
              </div>
          </div>

         

          <div 
            className={`fixed right-0 top-0 bottom-0 transition-all duration-300 ease-in-out ${
              isRightSidebarCollapsed ? 'w-8' : 'w-80'
            } bg-white border-l border-gray-200 shadow-xl z-40 flex flex-col`}
          >

            <button
              onClick={() => setIsRightSidebarCollapsed(!isRightSidebarCollapsed)}
              className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-12 bg-white border border-gray-200 rounded-l-md flex items-center justify-center hover:bg-gray-100 z-50"
            >
              {isRightSidebarCollapsed ? (
                <ChevronLeft className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
            
            {!isRightSidebarCollapsed && hasMounted && (
              <div className="flex flex-col h-full">

                <div className="flex flex-row items-center gap-1 px-4 py-2 border-b text-sm font-medium text-gray-700 bg-gray-50">
                  Chat <MessageCircle className="w-4 h-4"/>
                </div>
                
                <div className="border-t border-gray-200 flex flex-col flex-1 min-h-0">
                  <RealtimeChat 
                    roomName={roomName} 
                    username={user?.username ?? "Unknown user"} 
                    className="flex-1 min-h-0"
                  />
                </div>
              </div>
            )}
            
            {isRightSidebarCollapsed && (
              <div className="flex flex-col items-center justify-center h-full space-y-2">
                
              </div>
            )}
          </div>
        </div>
      </SidebarProvider>
    </>
  );
}