"use client";

import { useParams } from "next/navigation";
import { SidebarProvider } from "@/components/sidebar/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarTrigger } from "@/components/sidebar/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/commons/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/commons/breadcrumb";

import { useUserProjects } from "@/lib/browser_utils/useProjectStorage";
import { AddProjectForm } from "@/components/project_browser/AddProjectForm";
import { UserProjectsTable } from "@/components/project_browser/UserProjectsTable";
import { useEffect, useState } from "react";
import { getUserById } from "@/lib/commons/userService";


export default function UserProjectsPage() {
  const { id } = useParams() as { id: string };
  const { projects, loading, error, addProject, deleteProjects } = useUserProjects(id);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    getUserById(id)
      .then((user) => {
        setUserName(user.name);
      })
      .catch((err) => console.error("Error:", err));
  }, [id]);

  const handleDeleteSelected = async (selectedIds: string[]) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete ${selectedIds.length} project(s)?`
    );
    
    if (!isConfirmed) return;
  
    const success = await deleteProjects(selectedIds);
    
    if (!success) {
      alert('Failed to delete some projects. Please try again.');
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen">
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
                  <BreadcrumbPage>Profile</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>

          {/* Main Content */}
          <div className="flex flex-col flex-1 p-4">
            <h1 className="text-xl font-bold">Projects for {userName}</h1>
            
            <Card className="w-full max-w-xl mb-6">
              <CardHeader>
                <CardTitle>Project Management</CardTitle>
                <CardDescription>Add and manage user projects</CardDescription>
              </CardHeader>
              <CardContent>
                <AddProjectForm onAddProject={(projectName) => addProject(projectName, "")} />
              </CardContent>
            </Card>

            {loading && <p>Loading projects...</p>}
            {error && (
              <p className="text-red-600">
                Error loading projects: {error}
              </p>
            )}
            
            {!loading && !error && (
              <UserProjectsTable
                userId={id}
                projects={projects}
                onDeleteSelected={handleDeleteSelected}
              />
            )}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}