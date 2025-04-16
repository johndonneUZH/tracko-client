/* eslint-disable */
"use client"

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronsUpDown, Plus, Search } from "lucide-react"
import { ProjectsDialog } from "@components/settings_page/project_dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/project_browser/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/sidebar/sidebar"
import { Input } from "@/components/commons/input"
import { useProject } from '@/hooks/useProject'

export function TeamSwitcher({ teams }: {
  teams: {
    id: string // Make sure your team objects have an id property
    name: string
    logo: React.ElementType
    plan: string
  }[]
}) {
  const { projectId, updateProjectId } = useProject()
  const { isMobile } = useSidebar()
  const router = useRouter()
  const pathname = usePathname();
  const userId = sessionStorage.getItem("userId") || ""
  const [isOpen, setIsOpen] = useState(false);

  // Initialize activeTeam from sessionStorage or default to first team
  const [activeTeam, setActiveTeam] = useState<typeof teams[0] | undefined>(undefined)

  useEffect(() => {
    const storedProjectId = sessionStorage.getItem("projectId")
    const matchedTeam = storedProjectId
      ? teams.find(team => team.id === storedProjectId) || teams[0]
      : teams[0]

    setActiveTeam(matchedTeam)
  }, [teams])
  const [search, setSearch] = React.useState("")

  React.useEffect(() => {
    if (!userId) {
      router.push("/login")
    }
  }, [userId, router])

  const handleTeamSelect = (team: typeof teams[0]) => {
    updateProjectId(team.id)
    if (pathname.includes("/settings") && userId) {
      router.push(`/users/${userId}/projects/${team.id}/settings`);
    } else if (pathname.includes("/changelog") && userId) {
      router.push(`/users/${userId}/projects/${team.id}/changelog`);
    } else if (pathname.includes("/calendar") && userId) {
      router.push(`/users/${userId}/projects/${team.id}/calendar`);
    } else if (pathname.includes("/dashboard") && userId) {
      router.push(`/users/${userId}/projects/${team.id}/dashboard`);
    }
    setSearch("")
  }

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
    <SidebarMenu>
      <SidebarMenuItem>
        {!activeTeam ? (
          <ProjectsDialog variant="front"/>
        ) : (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-sidebar-primary-foreground">
                  <activeTeam.logo className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {activeTeam.name}
                  </span>
                  <span className="truncate text-xs">{activeTeam.plan}</span>
                </div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <div className="p-2" onKeyDown={(e) => e.stopPropagation()}>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
                  <Input
                    placeholder="Search projects..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-8 text-sm"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>

              <DropdownMenuLabel className="text-xs text-muted-foreground px-2">
                Projects
              </DropdownMenuLabel>
              <div className="max-h-[33vh] overflow-y-auto">
                {filteredTeams.length > 0 ? (
                  filteredTeams.map((team) => (
                    <DropdownMenuItem
                      key={team.id} // Using id as key is more reliable
                      onClick={() => handleTeamSelect(team)}
                      className="gap-2 p-2"
                    >
                      <div className="flex size-6 items-center justify-center rounded-sm border">
                        <team.logo className="size-4 shrink-0" />
                      </div>
                      {team.name}
                    </DropdownMenuItem>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    No projects found.
                  </div>
                )}
              </div>

              <DropdownMenuSeparator />
              <ProjectsDialog />
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </SidebarMenuItem>
    </SidebarMenu>
    </>
  )
}