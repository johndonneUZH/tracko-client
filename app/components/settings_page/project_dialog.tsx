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
import { useAutoAnimate } from '@formkit/auto-animate/react'
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
import { Plus, PlusCircle, UserPlus, X } from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";
import { useEffect, useState } from "react";
import { ApiService } from "@/api/apiService";
import { Checkbox } from "@/components/project_browser/checkbox";

interface Props {
  variant?: string;
}

export function ProjectsDialog({ variant }: Props) {
  const { id } = useParams() as { id: string };
  const { addProject } = useUserProjects(id);
  const [projectLogo, setProjectLogo] = useState("egg");
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [friends, setFriends] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const apiService = new ApiService();
  const [selectedFriendIds, setSelectedFriendIds] = useState<Set<string>>(new Set());
  const [isFriendDialogOpen, setIsFriendDialogOpen] = useState(false);
  const [parent, enableAnimations] = useAutoAnimate()

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
    addProject(
      projectName,
      projectDescription,
      projectLogo,
      Array.from(selectedFriendIds)
    );
  };

  const toggleFriend = (id: string) => {
    setSelectedFriendIds((prev) => {
      const updated = new Set(prev);
      if (updated.has(id)) {
        updated.delete(id);
      } else {
        updated.add(id);
      }
      return updated;
    });
  };

  const selectedFriends = friends.filter(friend => selectedFriendIds.has(friend.id));
  const filteredFriends = friends.filter(friend => 
    friend.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    friend.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              required
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
                <Label htmlFor="friends">Selected Friends</Label>
              <div className="flex flex-wrap gap-2" ref={parent}>
                {selectedFriends.map((friend) => (
                  <div
                    key={friend.id}
                    className="flex items-center space-x-2 px-3 py-1 rounded-full bg-gray-100 text-sm"
                  >
                    <Avatar className="h-5 w-5">
                      <AvatarImage
                        src={
                          friend.avatarUrl ||
                          `https://avatar.vercel.sh/${friend.username}`
                        }
                      />
                    </Avatar>
                    <span>{friend.name || friend.username}</span>
                    <button
                      onClick={() => toggleFriend(friend.id)}
                      className="hover:text-red-500"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            )}

          <DialogFooter className="gap-4 pt-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="min-w-25 w-auto py-3" variant="outline">
                <UserPlus />
                Add Friends
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Friends</DialogTitle>
                <DialogDescription>Select friends to add to your project.</DialogDescription>
              </DialogHeader>

              <div className="">
                <Input
                  type="text"
                  placeholder="Search friends..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              {selectedFriends.length > 0 && (
              <div className="flex flex-wrap gap-2" ref={parent}>
                {selectedFriends.map((friend) => (
                  <div
                    key={friend.id}
                    className="flex items-center space-x-2 px-3 py-1 rounded-full bg-gray-100 text-sm"
                  >
                    <Avatar className="h-5 w-5">
                      <AvatarImage
                        src={
                          friend.avatarUrl ||
                          `https://avatar.vercel.sh/${friend.username}`
                        }
                      />
                    </Avatar>
                    <span>{friend.name || friend.username}</span>
                    <button
                      onClick={() => toggleFriend(friend.id)}
                      className="hover:text-red-500"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
              )}
              <div className="relative max-h-64 overflow-y-auto pr-1">
                <div
                  className="sticky top-0 left-0 right-0 h-6 z-10 pointer-events-none"
                  style={{
                    background: "linear-gradient(to bottom, white, transparent)",
                  }}
                />
                <table className="w-full relative z-0">
                  <tbody>
                    {filteredFriends.map((friend) => (
                      <tr 
                        key={friend.id}
                        onClick={() => toggleFriend(friend.id)}
                        className="cursor-pointer"
                      >
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
                          <Checkbox
                            checked={selectedFriendIds.has(friend.id)}
                          />
                        </td>
                      </tr>
                    ))}
                    {filteredFriends.length === 0 && (
                      <tr>
                        <td colSpan={3} className="text-center text-sm py-2 text-gray-500">
                          No friends found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <div
                  className="sticky bottom-0 left-0 right-0 h-6 z-10 pointer-events-none"
                  style={{
                    background: "linear-gradient(to top, white, transparent)",
                  }}
                />
              </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" onClick={() => {}}>
                  Select
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
          </Dialog>
            <DialogClose asChild>
              <Button type="submit">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Project
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
