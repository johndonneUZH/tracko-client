"use client"

import * as React from "react"
import { ChevronsUpDown, Plus, Search } from "lucide-react"

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
<<<<<<<< HEAD:app/components/ui/navigation/team-switcher.tsx
} from "@/components/ui/navigation/sidebar"
========
} from "@/components/sidebar/sidebar"
import { Input } from "@/components/commons/input"
>>>>>>>> 49cc0026cd237939ab54eae25965739b2c8cd1d7:app/components/sidebar/team-switcher.tsx

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string
    logo: React.ElementType
    plan: string
  }[]
}) {
  const { isMobile } = useSidebar()
  const [activeTeam, setActiveTeam] = React.useState(teams[0])
  const [search, setSearch] = React.useState("")

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(search.toLowerCase())
  )

  if (!activeTeam) return null

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
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
                  key={team.name}
                  onClick={() => {
                    setActiveTeam(team)
                    setSearch("")
                  }}
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

            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">New Project</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
