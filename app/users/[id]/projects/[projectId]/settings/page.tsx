/* eslint-disable */

"use client";

import React, { useEffect, useState } from "react";
import { SidebarProvider } from "@/components/sidebar/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarTrigger } from "@/components/sidebar/sidebar";
import { Button } from "@/components/commons/button"
import { useRouter } from "next/navigation";
import { ApiService } from "@/api/apiService";
import { MembersTable } from "@/components/settings_page/members_table";
import { EditDialog } from "@/components/settings_page/edit_dialog";
import { useProject } from '@/hooks/useProject'
import { NewProject } from "@/components/commons/NewProject";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/commons/breadcrumb";

import {
  UserPlus,
  UserMinus,
  Trash2
} from "lucide-react"

import { DynamicIcon } from 'lucide-react/dynamic';

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
          { !currentProjectId ? <NewProject/> :
          <div className="m-4 space-y-4">
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
                { isOwner && (
                <div className="space-x-4">
                  <Button className="min-w-25 w-auto py-3" variant="destructive">
                    <Trash2/> Delete Project
                  </Button>
                  <EditDialog 
                    projectData={projectData}
                    reload={reload}
                    sidebarReload={sidebarReload}
                  />
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
              <p className="leading-7">
                Last updated: {projectData?.updatedAt ? new Date(projectData.updatedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }) : "Unknown"}
              </p>
            </div>
            <div>
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-2">
                Members
              </h3>
              <MembersTable ownerId = {projectData?.ownerId} />
              { isOwner && (
              <div className="flex-row space-x-4 mt-8">
                <Button className="min-w-25" onClick= {() => {}}>
                  <UserPlus />Invite
                </Button>
                <Button className="min-w-25" variant="destructive" onClick= {() => {}}>
                  <UserMinus /> Kick
                </Button>
              </div>
              )}
            </div>
          </div>
          }
        </div>
      </div>
    </SidebarProvider>
  );
}