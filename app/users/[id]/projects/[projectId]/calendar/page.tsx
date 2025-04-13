"use client";

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

import { useProject } from '@/hooks/useProject'
import { NewProject } from "@/components/commons/NewProject";

export default function CalendarPage() {

  const { projectId: currentProjectId } = useProject()

  return (
    <SidebarProvider>
      <div className="flex h-screen">
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
                  <BreadcrumbPage>Calendar</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          { !currentProjectId ? <NewProject/> :
          <div className="flex flex-col flex-1 p-4">
            <h1 className="text-xl font-bold">Calendar</h1>
          </div>
          }
        </div>
      </div>
    </SidebarProvider>
  );
}