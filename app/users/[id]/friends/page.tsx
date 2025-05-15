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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";

export default function FriendsPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const tabOrder = ["friends", "pending", "sent"];
  const [tabValue, setTabValue] = useState("friends");
  const [prevTabIndex, setPrevTabIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const apiService = new ApiService();
  const router = useRouter();
  const [reload, setReload] = useState(false);

  useEffect(() => {
    const storedUserId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");

    if (!storedUserId || !token) {
      router.push("/login");
      return;
    }

    setUserId(storedUserId);
  }, [router]);

  function triggerReload() {
    setReload(!reload);
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
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
                  <BreadcrumbPage>Friends</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>
  
          <div className="flex flex-grow w-full h-full">
            <div className="flex flex-row w-full">
              <div className="w-1/2">
                <FriendsTable reload={reload} triggerReload={triggerReload} />
              </div>
              <div className="w-1/2">
                <div className="h-1/2">
                  <PendingRequestsTable reload={reload} triggerReload={triggerReload} />
                </div>
                <div className="h-1/2">
                  <SentRequestsTable reload={reload} triggerReload={triggerReload} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}  