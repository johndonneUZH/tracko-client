"use client"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/commons/avatar"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
<<<<<<<< HEAD:app/components/ui/navigation/nav-user.tsx
} from "@/components/ui/navigation/sidebar"
========
} from "@/components/sidebar/sidebar"
>>>>>>>> 49cc0026cd237939ab54eae25965739b2c8cd1d7:app/components/sidebar/nav-user.tsx

import { useRouter } from "next/navigation";

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {

  const router = useRouter();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          onClick= {()=>router.push("/users/1")}
        >
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="rounded-lg">CN</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{user.name}</span>
            <span className="truncate text-xs">{user.email}</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
