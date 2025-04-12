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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/commons/breadcrumb";

import {
  Pencil,
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

  const apiService = new ApiService();

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
  }, []);

  //useEffect(() => {
  //  const fetchMemberData = async () => {
  //    const ownerId = projectData?.ownerId
  //    const memberIds = projectData?.projectMembers
  //
  //    if (!ownerId) {
  //      router.push("/login");
  //      return;
  //    }
  
  //    try {
  //      const ownerData = await apiService.get<MemberData>(`/users/${ownerId}`)
  //      setProjectData(ownerData);
  //    } catch (error) {
  //      console.error("Error fetching member data:", error);
  //    }
  //  };
  
  //  fetchMemberData();
  //}, []);

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        {/* Sidebar */}
        <AppSidebar className="w-64 shrink-0" />

        {/* Main Content Wrapper */}
        <div className="flex flex-col flex-1">
          {/* Fixed Header with Breadcrumb */}
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
                <Button className="min-w-25 w-auto py-3" onClick= {() => {}}>
                  <Pencil/> Edit
                </Button>
              </div>
            </div>
            <div>
              <p className="leading-7">
                Owner Id: {projectData?.ownerId}
              </p>
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
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                Members
              </h3>
              <MembersTable />
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}