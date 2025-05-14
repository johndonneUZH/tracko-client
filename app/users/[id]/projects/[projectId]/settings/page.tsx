/* eslint-disable */

"use client";

import React, { useEffect, useState } from "react";
import { SidebarProvider } from "@/components/sidebar/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarTrigger } from "@/components/sidebar/sidebar";
import { useRouter } from "next/navigation";
import { ApiService } from "@/api/apiService";
import { MembersTable } from "@/components/settings_page/members_table";
import { EditDialog } from "@/components/settings_page/edit_dialog";
import { useProject } from '@/hooks/useProject';
import { FriendsDialog } from "@/components/settings_page/friends_dialog";
import { KickDialog } from "@/components/settings_page/kick_dialog";
import { User } from "@/types/user";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/commons/breadcrumb";

import { DynamicIcon } from 'lucide-react/dynamic';
import { DeleteDialog } from "@/components/settings_page/delete_dialog";
import { LeaveDialog } from "@/components/settings_page/leave_dialog";

interface ProjectData {
  projectName: string;
  projectDescription: string;
  projectMembers: string[];
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  projectLogoUrl: string;
}

export default function SettingsPage() {
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const router = useRouter();
  const iconName = (projectData?.projectLogoUrl.toLowerCase() || "university") as any
  const [isOwner, setIsOwner] = useState(false);
  const [triggerReload, setTriggerReload] = useState(false);
  const apiService = new ApiService();
  const [triggerSidebarReload, setTriggerSidebarReload] = useState(false);
  const { projectId: currentProjectId } = useProject()
  const [friends, setFriends] = useState<User[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<User[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<User[]>([]);
  const [members, setMembers] = useState<User[]>([]);

  const reload = () => {
    setTriggerReload(triggerReload => !triggerReload);
  };

  const sidebarReload = () => {
    setTriggerSidebarReload(triggerSidebarReload => !triggerSidebarReload);
  };

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
        setIsOwner(data?.ownerId === sessionStorage.getItem("userId"));
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
  
    fetchProjectData();
  }, [triggerReload, currentProjectId]);

  useEffect(() => {   
    const storedUserId = sessionStorage.getItem("userId");
  
    if (!storedUserId) {
      router.push("/login");
      return;
    }
  
    const fetchFriends = async () => {
      try {
        const data = await apiService.getFriends<User[]>(storedUserId);
        setFriends(data);
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };
  
    fetchFriends();
  }, [triggerReload, router]);

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
  }, [triggerReload]); 

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar className="w-64 shrink-0" triggerReload={triggerSidebarReload}/>
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
                  <BreadcrumbPage>Settings</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>
            <div className="m-4 mt-0 space-y-4">
              <div className="flex justify-between">
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
                <div className="space-x-4 items-center">
                  {isOwner ? (
                    <div className="space-x-4">
                      <EditDialog 
                        projectData={projectData}
                        reload={reload}
                        sidebarReload={sidebarReload}
                      />
                      <DeleteDialog />
                    </div>
                  ) : (
                    <div className="space-x-4">
                      <LeaveDialog />
                    </div>
                  )}  
                </div>
              </div>
              <div>
                <p className="leading-7">
                  Created: {projectData?.createdAt ? new Date(projectData.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }) : "Unknown"}
                </p>
              </div>
              <div className="mb-8">
                <div className="flex flex-row justify-between items-end mb-2">
                  <div>
                    <h3 className="text-sm font-semibold text-green-700 bg-green-100 rounded-full px-2 py-1 w-min">Admin</h3>
                  </div>
                  {isOwner && (
                    <div className="flex flex-row space-x-4">
                      <FriendsDialog friends={friends.filter(friend => !members.some(member => member.id === friend.id))} onAddFriends={reload} />
                      <KickDialog members={members} onAddMembers={reload} ownerId={projectData?.ownerId} />
                    </div>
                  )}
                </div>
                <MembersTable ownerId={projectData?.ownerId} members={members}/>
              </div>
            </div>
        </div>
      </div>
    </SidebarProvider>
  );
}