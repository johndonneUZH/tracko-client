/* eslint-disable */

"use client";

import { SidebarProvider } from "@/components/sidebar/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarTrigger } from "@/components/sidebar/sidebar";
import { Button } from "@/components/commons/button";
import { LogoDialog } from "@/components/settings_page/logo_dialog";
import { Input } from "@/components/commons/input"
import { Label } from "@/components/commons/label"
import { FriendsDialog } from "@/components/settings_page/friends_dialog";
import { User } from "@/types/user";
import { useRouter } from "next/navigation";
import {
  Avatar,
  AvatarImage,
} from "@/components/commons/avatar"

import { 
  PlusCircle,
 } from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/commons/breadcrumb";

import { useEffect, useState } from "react";
import { ApiService } from "@/api/apiService"


export default function UserProjectsPage() {
  const [projectLogo, setProjectLogo] = useState("egg");
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [friends, setFriends] = useState<User[]>([]);
  const router = useRouter();
  const apiService = new ApiService();
  const [selectedFriends, setSelectedFriends] = useState<User[]>([]);

  useEffect(() => {   
    const storedUserId = sessionStorage.getItem("userId");
  
    if (!storedUserId) {
      router.push("/login");
      return;
    }
  
    const fetchFriends = async () => {
      try {
        const data = await apiService.getFriends<User[]>(storedUserId);
        setFriends(data);
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };
  
    fetchFriends();
    }, [router]);

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar className="w-64 shrink-0" />
        <div className="flex flex-col flex-1">
          <header className="flex h-16 items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1 mr-2" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Create Project</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          <div className="flex flex-col flex-1 w-full p-4 space-y-4">
            <div className="flex justify-between">
              <div className="relative w-fit">
                <DynamicIcon
                    className="h-16 w-16 rounded-lg bg-primary p-2 text-white"
                    name={(projectLogo?.toLowerCase() || "egg") as any}
                />
                <LogoDialog setLogo={setProjectLogo}/>
              </div>
              <Button>
                <PlusCircle/>Create new Project
              </Button>
            </div>
            <div className="grid grid-cols-4 items-center gap-4 max-w-100">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input 
                  id="name" 
                  value={projectName} 
                  className="col-span-3"
                  onChange={(e) => setProjectName(e.target.value)} 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4 max-w-100">
              <Label htmlFor="username" className="text-right">
                Description
              </Label>
              <Input 
                  id="username" 
                  value={projectDescription} 
                  className="col-span-3" 
                  onChange={(e) => setProjectDescription(e.target.value)}
              />
            </div>
            <table className="w-full">
              <tbody>
              {selectedFriends.map((friend) => (
                <tr key={friend.id}>
                  <td className="px-2 py-1 text-left w-1">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={
                          friend.avatarUrl ||
                          `https://avatar.vercel.sh/${friend.username}`
                        }
                      />
                    </Avatar>
                    </td>
                    <td className="px-2 py-1 text-left w-full">
                      {friend.name || friend.username}
                    </td>
                    <td className="px-2 py-1 text-right w-1">
                    <span className={`h-3 w-3 rounded-full inline-block ${
                      friend.status === "ONLINE" ? "bg-green-500" : "bg-red-500"
                    }`}></span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex max-w-40">
              <FriendsDialog friends={friends} onAddFriends={setSelectedFriends}/>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}