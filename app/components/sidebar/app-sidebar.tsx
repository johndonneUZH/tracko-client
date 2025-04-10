/* eslint-disable */
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
import { useEffect, useState } from "react";
import { Project } from "@/types/project";
import { useRouter } from "next/navigation";
import { useProject } from '@/hooks/useProject'

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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [data, setData] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>("");
  const { projectId: currentProjectId } = useProject()
  const router = useRouter();

  useEffect(() => {
    const sessionUserId = sessionStorage.getItem("userId")
    if (sessionUserId) {
      setUserId(sessionUserId)
    } else {
      router.push("/login")
    }
  }, [router])

  const getNavItems = React.useCallback((userId: string, projectId: string) => {
    return {
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
  }, []);


  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        const [user, projects] = await Promise.all([
          apiService.getUser<User>(userId),
          apiService.getProjects<Project[]>(userId),
        ]);

        const activeProjectId = currentProjectId || projects[0]?.projectId || "";
        
        // Only update sessionStorage if it's empty
        if (!sessionStorage.getItem("projectId") && activeProjectId) {
          sessionStorage.setItem("projectId", activeProjectId);
        }

        const teams = projects.map(project => ({
          id: project.projectId,
          name: project.projectName,
          logo: getComponentFromString(project.projectLogoUrl),
          plan: project.projectDescription,
        }));

        setData({
          user: {
            id: userId,
            name: user.name,
            email: user.email,
            avatar: user.avatarUrl,
          },
          teams,
          ...getNavItems(userId, activeProjectId),
        });
      } catch (error) {
        console.error("Failed to load data:", error);
      }
    };

    // Add a small debounce to prevent rapid fires
    const timer = setTimeout(fetchData, 100);
    return () => clearTimeout(timer);
  }, [userId, currentProjectId, getNavItems]);

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

