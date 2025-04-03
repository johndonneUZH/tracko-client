"use client";

import { useParams } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { useUserProjects } from "@/lib/browser_utils/useProjectStorage";
import { AddProjectForm } from "@/components/project_browser/AddProjectForm";
import { UserProjectsTable } from "@/components/project_browser/UserProjectsTable";

export default function UserProjectsPage() {
  const { id } = useParams() as { id: string };

  // Use the custom hook to handle local storage and state
  const {
    projects,
    addProject,
    deleteProjects,
  } = useUserProjects(id);

  // When user confirms deletion from the table
  function handleDeleteSelected(projectIds: number[]) {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete ${projectIds.length} project(s)?`
    );
    if (isConfirmed) {
      deleteProjects(projectIds);
    }
  }

  return (
    <SidebarProvider>
      <div className="flex justify-center items-center min-h-screen">
        <AppSidebar />
        <SidebarInset className="flex-1 max-w-7xl px-4">
          <header className="flex h-16 shrink-0 items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-xl font-bold">Projects for User {id}</h1>
          </header>

          <div className="flex flex-col items-center p-8">
            <Card className="w-full max-w-xl mb-6">
              <CardHeader>
                <CardTitle>Project Management</CardTitle>
                <CardDescription>Add and manage user projects</CardDescription>
              </CardHeader>
              <CardContent>
                <AddProjectForm onAddProject={addProject} />
              </CardContent>
            </Card>

            <UserProjectsTable
              userId={id}
              projects={projects}
              onDeleteSelected={handleDeleteSelected}
            />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
