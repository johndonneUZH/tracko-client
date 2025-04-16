/* eslint-disable */

"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/commons/button";
import { LogoDialog } from "@/components/settings_page/logo_dialog";
import { Input } from "@/components/commons/input";
import { Label } from "@/components/commons/label";
import { FriendsDialog } from "@/components/settings_page/friends_dialog";
import { User } from "@/types/user";
import { useRouter } from "next/navigation";
import { useUserProjects } from "@/lib/browser_utils/useProjectStorage";
import { SidebarMenuButton } from "@/components/sidebar/sidebar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/project_browser/dialog";
import {
  Avatar,
  AvatarImage,
} from "@/components/commons/avatar";

import { Plus, PlusCircle } from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";

import { useEffect, useState } from "react";
import { ApiService } from "@/api/apiService";

interface Props {
  variant?: string
}

export function ProjectsDialog( {variant} : Props) {
  const { id } = useParams() as { id: string };
  const { addProject } = useUserProjects(id);
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
        console.error("Error fetching friends:", err);
      }
    };

    fetchFriends();
  }, [router]);

  const handleCreate = () => {
    addProject(projectDescription, projectName);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {variant === "front" ? (
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-sidebar-primary-foreground">
            <Plus className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-semibold">
            New Project
          </span>
        </div>
        </SidebarMenuButton>
        ) : (
        <div
          className="flex flex-row gap-2 p-2 text-sidebar-accent-foreground hover:bg-gray-100 rounded-sm text-center items-center"
          role="button"
        >
          <div className="flex size-6 items-center justify-center text-center rounded-md border bg-background">
            <Plus className="size-4 text-muted-foreground" />
          </div>
          <div className="text-sm">New Project</div>
        </div>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Project</DialogTitle>
          <DialogDescription>
            Customize your project and invite your friends.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreate();
          }}
          className="flex flex-col flex-1 w-full space-y-4"
        >
          <div className="flex justify-start">
            <div className="relative w-fit">
              <DynamicIcon
                className="h-16 w-16 rounded-lg bg-primary p-2 text-white"
                name={(projectLogo?.toLowerCase() || "egg") as any}
              />
              <LogoDialog setLogo={setProjectLogo} />
            </div>
          </div>

          <div className="flex flex-col space-y-1">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>

          <div className="flex flex-col space-y-1">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
            />
          </div>

          {selectedFriends.length > 0 && (
          <div className="flex flex-col space-y-1">
            <Label>Selected Friends</Label>
            
            <div className="relative">
              <div className="absolute top-0 left-0 right-0 h-6 z-10 pointer-events-none bg-gradient-to-b from-white to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 h-6 z-10 pointer-events-none bg-gradient-to-t from-white to-transparent" />

              <div className="max-h-48 overflow-y-auto pr-1 relative z-0">
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
                          <span
                            className={`h-3 w-3 rounded-full inline-block ${
                              friend.status === "ONLINE"
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          ></span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

          <DialogFooter className="gap-4 pt-2">
            <FriendsDialog
              friends={friends}
              onAddFriends={setSelectedFriends}
            />
            <DialogClose asChild>
              <Button type="submit">
                <PlusCircle className="" />
                Create Project
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
