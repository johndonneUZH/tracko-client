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
  Calendar,
  Archive,
  Bell
} from "lucide-react"

import { NavMain } from "@/components/sidebar/nav-main"
import { NavSecondary } from "@/components/sidebar/nav-secondary"
import { NavUser } from "@/components/sidebar/nav-user"
import { TeamSwitcher } from "@/components/sidebar/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/sidebar/sidebar"
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
  navSecondary: [
    {
      title: "Project Browser",
      url: `/users/${mockUserId}/projects`,
      icon: Archive,
      isActive: true,
    },
    {
      title: "Notifications",
      url: "#",
      icon: Bell,
    },
    {
      title: "Friends",
      url: "#",
      icon: Users,
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
        <NavSecondary items={data.navSecondary} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
