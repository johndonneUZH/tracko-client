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

          <div className="flex flex-col items-center justify-center px-4 pb-6 flex-grow w-full mt-32">
  <Tabs
    value={tabValue}
    onValueChange={(newValue) => {
      const newIndex = tabOrder.indexOf(newValue);
      const currentIndex = tabOrder.indexOf(tabValue);
      setPrevTabIndex(currentIndex);
      setDirection(newIndex > currentIndex ? 1 : -1);
      setTabValue(newValue);
    }}
    className="w-full flex flex-col items-center"
  >
    <div className="max-w-2xl mx-auto w-full">
      <TabsList className="flex w-full">
        <TabsTrigger value="friends" className="flex-1 text-center cursor-pointer">
          Friends
        </TabsTrigger>
        <TabsTrigger value="pending" className="flex-1 text-center cursor-pointer">
          Pending
        </TabsTrigger>
        <TabsTrigger value="sent" className="flex-1 text-center cursor-pointer">
          Sent
        </TabsTrigger>
      </TabsList>
    </div>

            <div className="relative w-full">
                <AnimatePresence mode="wait">
                  {tabValue === "friends" && (
                    <motion.div
                      key="friends"
                      initial={{ x: direction * 100, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -direction * 100, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-full"
                    >
                      <FriendsTable />
                    </motion.div>
                  )}

                  {tabValue === "pending" && (
                    <motion.div
                      key="pending"
                      initial={{ x: direction * 100, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -direction * 100, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-full"
                    >
                      <PendingRequestsTable />
                    </motion.div>
                  )}

                  {tabValue === "sent" && (
                    <motion.div
                      key="sent"
                      initial={{ x: direction * 100, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -direction * 100, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-full"
                    >
                      <SentRequestsTable />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}

