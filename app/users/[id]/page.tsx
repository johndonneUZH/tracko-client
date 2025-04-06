"use client";

import React from "react";

import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { Separator } from "@/components/commons/separator"
import { Button } from "@/components/commons/button"
import { useRouter } from "next/navigation";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/sidebar/sidebar"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/commons/breadcrumb"

import {
  Avatar,
  AvatarImage,
} from "@/components/commons/avatar"

import { ProjectsTable } from "@/components/user_page/projects-table"
import { FriendsTable } from "@/components/user_page/friends-table"

import {
  Mail,
  Gift,
  Calendar1,
  ShieldCheck,
  Pencil,
  LogOut,
} from "lucide-react"
import { ContributionsChart } from "@/components/user_page/contributions-chart";

export default function Page() {
  const router = useRouter();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Profile</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="m-4 space-y-4">
          <div className="flex justify-between">
            <div className="flex space-x-4 items-center">
              <Avatar className="h-16 w-16 rounded-lg">
                <AvatarImage src={"https://avatar.vercel.sh/john"} />
              </Avatar>
              <div>
                <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                  Max Muster
                </h3>
                <p className="leading-7">
                  @maxmuster
                </p>
              </div>
            </div>
            <div className="space-x-4 items-center">
              <Button className="min-w-25 w-auto py-3">
                <Pencil/> Edit
              </Button>
              <Button className="min-w-25 w-auto py-3" onClick= {()=>router.push("/")}>
                <LogOut/> Log Out
              </Button>
            </div>
          </div>
          <div>
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              About
            </h3>
            <Separator />
            <div className="space-y-2 my-4">
              <div className="flex gap-2 items-center">
                <Mail />
                <p className="leading-7">
                  Email: maxmuster@example.com
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <Gift />
                <p className="leading-7">
                  Birthday: 14.12.2003
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <Calendar1 />
                <p className="leading-7">
                  Joined: 03.04.2025
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <ShieldCheck />
                <p className="leading-7">
                  Last Active: 3h ago
                </p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              Projects
            </h3>
            <Separator />
            <div className="space-y-2 my-4">
              <div className="my-6 w-full overflow-y-auto">
                <ProjectsTable/>
              </div>
            </div>
          </div>
          <div>
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              Friends
            </h3>
            <Separator />
            <div className="space-y-2 my-4">
              <div className="my-6 w-full overflow-y-auto">
                <FriendsTable/>
              </div>
            </div>
          </div>
          <div>
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              Activity
            </h3>
            <Separator />
            <div className="space-y-2 my-4">
              <div className="my-6 w-full overflow-y-auto">
                <ContributionsChart/>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
