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

interface UserData {
  friends: string[];
}

export default function FriendsPage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const apiService = new ApiService();
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = sessionStorage.getItem("userId");
      const token = sessionStorage.getItem("token");

      if (!userId || !token) {
        router.push("/login");
        return;
      }

      try {
        const data = await apiService.get<UserData>(`/users/${userId}`);
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
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
          <div className="px-4">
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              Friends
            </h3>
            <div className="space-y-2 my-4">
              <div className="mt-6 w-full overflow-y-auto pt-4">
                <FriendsTable />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
