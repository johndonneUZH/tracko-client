"use client";

import { useEffect, useState } from "react";
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
import { useNotification } from "@/lib/dashboard_utils/useNotificationStorage";

export default function NotificationsPage() {
  const [projectId, setProjectId] = useState<string>("defaultProjectId"); // Default value

  // Access sessionStorage only on the client side
  useEffect(() => {
    const storedProjectId = sessionStorage.getItem("projectId");
    if (storedProjectId) {
      setProjectId(storedProjectId);
    }

    console.log("NotificationsPage rendered with projectId:", storedProjectId);
  }, []);

  useNotification();

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
                  <BreadcrumbPage>Notifications</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>

          {/* Main Content */}
          <div className="flex flex-col flex-1 p-4">
            <h1 className="text-xl font-bold">Notifications</h1>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
