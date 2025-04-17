/* eslint-disable */

"use client";
import React, { useEffect, useState } from "react";
import { ApiService } from "@/api/apiService";
import { SidebarProvider } from "@/components/sidebar/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarTrigger } from "@/components/sidebar/sidebar";
import { useRouter } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/commons/breadcrumb";
import { FriendsTable } from "@/components/user_page/friends-table";
import PendingRequestsTable from "@/components/user_page/pending-table";
import SentRequestsTable from "@/components/user_page/sent-table"; 

export default function FriendsPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const apiService = new ApiService();
  const router = useRouter();

  useEffect(() => {
    const storedUserId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");

    if (!storedUserId || !token) {
      router.push("/login");
      return;
    }

    setUserId(storedUserId);
  }, [router]);

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
                  <BreadcrumbPage>Friends</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>

          {/* Main Content */}
          <div className="px-4 pb-6 space-y-10 overflow-y-auto">
            <div>
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                Friends
              </h3>
              <div className="mt-4">
                <FriendsTable />
              </div>
            </div>

            <div>
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                Pending Requests
              </h3>
              <div className="mt-4">
                <PendingRequestsTable />
              </div>
            </div>

            <div>
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                Sent Requests
              </h3>
              <div className="mt-4">
                <SentRequestsTable />
              </div>
            </div> 
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
