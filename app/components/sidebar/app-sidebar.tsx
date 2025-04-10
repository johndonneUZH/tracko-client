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

<<<<<<<< HEAD:app/components/ui/navigation/app-sidebar.tsx
import { NavMain } from "@/components/ui/navigation/nav-main"
import { NavUser } from "@/components/ui/navigation/nav-user"
import { TeamSwitcher } from "@/components/ui/navigation/team-switcher"
========
import { NavMain } from "@/components/sidebar/nav-main"
import { NavSecondary } from "@/components/sidebar/nav-secondary"
import { NavUser } from "@/components/sidebar/nav-user"
import { TeamSwitcher } from "@/components/sidebar/team-switcher"
>>>>>>>> 49cc0026cd237939ab54eae25965739b2c8cd1d7:app/components/sidebar/app-sidebar.tsx
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
<<<<<<<< HEAD:app/components/ui/navigation/app-sidebar.tsx
} from "@/components/ui/navigation/sidebar"
========
} from "@/components/sidebar/sidebar"
>>>>>>>> 49cc0026cd237939ab54eae25965739b2c8cd1d7:app/components/sidebar/app-sidebar.tsx
const mockUserId = 1 //To be changed with the backend
const mockProjectId = 101 //To be changed with the backend
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
      url: `/users/${mockUserId}/projects/${mockProjectId}/dashboard`,
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Changelog",
      url: `/users/${mockUserId}/projects/${mockProjectId}/changelog`,
      icon: FileClock,
    },
    {
        title: "Calendar",
        url: `/users/${mockUserId}/projects/${mockProjectId}/calendar`,
        icon: Calendar,
    },
    {
      title: "Settings",
      url: `/users/${mockUserId}/projects/${mockProjectId}/settings`,
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
      url: `/users/${mockUserId}/notifications`,
      icon: Bell,
    },
    {
      title: "Friends",
      url: `/users/${mockUserId}/friends`,
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
