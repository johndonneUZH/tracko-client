/* eslint-disable */
"use client";

import * as React from "react";
import {
  Settings2,
  LayoutDashboard,
  FileClock,
  Users,
  Calendar,
  Bell,
  PlusCircle,
  Download
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
import { getComponentFromString } from "@/components/sidebar/iconMappings";

const apiService = new ApiService();

type AppSidebarProps = Omit<React.ComponentProps<typeof Sidebar>, "triggerReload"> & {
  triggerReload?: any;
};

export function AppSidebar({ triggerReload = null, ...props }: AppSidebarProps) {
  const [data, setData] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>("");
  const { projectId: currentProjectId, updateProjectId } = useProject()
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
          title: "Settings",
          url: `/users/${userId}/projects/${projectId}/settings`,
          icon: Settings2,
        },
      ],
      navSecondary: [
        {
          title: "Friends",
          url: `/users/${userId}/friends`,
          icon: Users,
        },
        {
          title: "Reports",
          url: `/users/${userId}/reports`,
          icon: Download,
        }
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

        // Determine active projectId
        const validProjectIds = projects.map(p => p.projectId);
        let activeProjectId = currentProjectId;

        if (!validProjectIds.includes(currentProjectId)) {
          // Fallback to first available project
          activeProjectId = projects[0]?.projectId || "";

          // Update session and hook
          if (activeProjectId) {
            sessionStorage.setItem("projectId", activeProjectId);
            updateProjectId(activeProjectId);
          } else {
            // No valid project at all
            sessionStorage.removeItem("projectId");
            updateProjectId("");
          }
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
  }, [userId, currentProjectId, getNavItems, triggerReload]);

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
        {currentProjectId && (
          <NavMain items={data.navMain} />
        )}
        <NavSecondary items={data.navSecondary} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );

}

