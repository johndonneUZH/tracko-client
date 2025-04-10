"use client";

import * as React from "react";
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
  Bell,
} from "lucide-react";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavSecondary } from "@/components/sidebar/nav-secondary";
import { NavUser } from "@/components/sidebar/nav-user";
import { TeamSwitcher } from "@/components/sidebar/team-switcher";
import { ApiService } from "@/api/apiService";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/sidebar/sidebar";
import { User } from "@/types/user";
import { useEffect } from "react";
import { Project } from "@/types/project";
import { get } from "http";

const apiService = new ApiService();

const componentMap: Record<string, React.ElementType> = {
  "University": University,
  "Settings2": Settings2,
  "Apple": Apple,
  "Brain": Brain,
  "LayoutDashboard": LayoutDashboard,
  "FileClock": FileClock,
  "Users": Users,
  "Calendar": Calendar,
  "Archive": Archive,
  "Bell": Bell,
};

function getComponentFromString(componentName: string): React.ElementType | null {
  const Component = componentMap[componentName];
  if (!Component) {
    console.error(`Component "${componentName}" not found.`);
    return null;
  }
  return Component; 
}

async function prepateData(userId: string) {
  const user = await apiService.getUser<User>(userId);
  const projects = await apiService.getProjects<Project[]>(userId);
  const projectId = 1;
  const teams = [];
  for (const project of projects) {
    teams.push({
      name: project.projectName,
      logo: getComponentFromString(project.projectLogoUrl),
      plan: project.projectDescription,
    });
  }


  const data = {
    user: {
      name: user.name,
      email: user.email,
      avatar: user.avatarUrl,
    },
    teams: teams,
    navMain: [
      {
        title: "Dashboard",
        url: `/users/${userId}/projects/${projectId}/dashboard`,
        icon: LayoutDashboard,
        isActive: true,
      },
      {
        title: "Changelog",
        url: `/users/${userId}/projects/${projectId}/changelog`,
        icon: FileClock,
      },
      {
        title: "Calendar",
        url: `/users/${userId}/projects/${projectId}/calendar`,
        icon: Calendar,
      },
      {
        title: "Settings",
        url: `/users/${userId}/projects/${projectId}/settings`,
        icon: Settings2,
      },
    ],
    navSecondary: [
      {
        title: "Project Browser",
        url: `/users/${userId}/projects`,
        icon: Archive,
        isActive: true,
      },
      {
        title: "Notifications",
        url: `/users/${userId}/notifications`,
        icon: Bell,
      },
      {
        title: "Friends",
        url: `/users/${userId}/friends`,
        icon: Users,
      },
    ],
  };
  return data;
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [data, setData] = React.useState<any>(null);
  const [userId, setUserId] = React.useState<string | null>("");

  useEffect(() => {
    const sessionUserId = sessionStorage.getItem("userId");
    if (sessionUserId) {
      setUserId(sessionUserId);
    }
    else {
      console.error("User ID not found in session storage.");
      window.location.href = "/login";
    }
  }, []);

  useEffect(() => {
    if (userId) {
      prepateData(userId).then((data) => {
        setData(data);
      });
    }
  }, [userId]);

  if (!data) {
    return (
      <div className="flex flex-col items-start justify-center h-screen pt-10 px-4">
        <div className="flex space-x-2">
          <div className="h-4 w-4 bg-blue-700 rounded-full animate-bounce"></div>
          <div className="h-4 w-4 bg-blue-800 rounded-full animate-bounce delay-200"></div>
          <div className="h-4 w-4 bg-blue-900 rounded-full animate-bounce delay-400"></div>
        </div>
      </div>
    );
  }

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
  );
}
