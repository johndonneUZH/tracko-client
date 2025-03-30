"use client"

import * as React from "react"
import {
  University,
  ChartLine,
  Settings2,
  Apple,
  Brain,
  LayoutDashboard,
  FileClock,
  Users,
  Calendar,
  Bell
} from "lucide-react"

import { NavMain } from "@/components/ui/nav-main"
import { NavProjects } from "@/components/ui/nav-projects"
import { NavUser } from "@/components/ui/nav-user"
import { TeamSwitcher } from "@/components/ui/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

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
      url: "#",
      icon: LayoutDashboard,
      isActive: true,
      items: [
        {
          title: "Item 1",
          url: "#",
        },
        {
          title: "Item 2",
          url: "#",
        },
        {
          title: "Item 3",
          url: "#",
        },
      ],
    },
    {
      title: "Changelog",
      url: "#",
      icon: FileClock,
      items: [
        {
          title: "Item 1",
          url: "#",
        },
        {
          title: "Item 2",
          url: "#",
        },
        {
          title: "Item 3",
          url: "#",
        },
      ],
    },
    {
      title: "Members",
      url: "#",
      icon: Users,
      items: [
        {
          title: "Item 1",
          url: "#",
        },
        {
          title: "Item 2",
          url: "#",
        },
        {
          title: "Item 3",
          url: "#",
        },
      ],
    },
    {
        title: "Calendar",
        url: "#",
        icon: Calendar,
        items: [
          {
            title: "Item 1",
            url: "#",
          },
          {
            title: "Item 2",
            url: "#",
          },
          {
            title: "Item 3",
            url: "#",
          },
        ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Item 1",
          url: "#",
        },
        {
          title: "Item 2",
          url: "#",
        },
        {
          title: "Item 3",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Notifications",
      url: "#",
      icon: Bell,
    },
    {
      name: "Friends",
      url: "#",
      icon: Users,
    },
    {
      name: "Insights",
      url: "#",
      icon: ChartLine,
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
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
