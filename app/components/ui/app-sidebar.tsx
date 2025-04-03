"use client"

import * as React from "react"
import {
  University,
  Settings2,
  Apple,
  Brain,
  LayoutDashboard,
  FileClock,
  Users,
  Calendar
} from "lucide-react"

import { NavMain } from "@/components/ui/nav-main"
import { NavUser } from "@/components/ui/nav-user"
import { TeamSwitcher } from "@/components/ui/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { mock } from "node:test"
const mockUserId = 1 //To be changed with the backend
const data = {
  user: {
    name: "Max Muster",
    email: "maxmuster@example.com",
    avatar: "https://avatar.vercel.sh/jack",
  },
  teams: [
    {
      name: "Sopra",
      logo: University,
      plan: "University of Zurich",
    },
    {
      name: "Tracko",
      logo: Brain,
      plan: "Startup",
    },
    {
      name: "Apple",
      logo: Apple,
      plan: "Work",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: `/users/${mockUserId}/projects`,
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Changelog",
      url: "#",
      icon: FileClock,
    },
    {
      title: "Members",
      url: "#",
      icon: Users,
    },
    {
        title: "Calendar",
        url: "#",
        icon: Calendar,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
