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
              <Label>Selected Friends</Label>
              <div className="relative">
                <div className="max-h-48 overflow-y-auto border rounded-md p-2">
                  {selectedFriends.map((friend) => (
                    <div key={friend.id} className="flex items-center justify-between p-1">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={friend.avatarUrl || `https://avatar.vercel.sh/${friend.username}`}
                          />
                        </Avatar>
                        <span>{friend.name || friend.username}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFriend(friend.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-4 pt-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button type="button" variant="outline">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Friends
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Friends to Project</DialogTitle>
                  <DialogDescription>
                    Select friends to invite to your new project
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Search friends..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="max-h-60 overflow-y-auto">
                    {filteredFriends.map((friend) => (
                      <div key={friend.id} className="flex items-center justify-between p-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={friend.avatarUrl || `https://avatar.vercel.sh/${friend.username}`}
                            />
                          </Avatar>
                          <div>
                            <div>{friend.name || friend.username}</div>
                          </div>
                        </div>
                        <Checkbox
                          checked={selectedFriendIds.has(friend.id)}
                          onCheckedChange={() => toggleFriend(friend.id)}
                        />
                      </div>
                    ))}
                    {filteredFriends.length === 0 && (
                      <div className="text-center text-sm text-gray-500 py-4">
                        No friends found
                      </div>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button">Done</Button>
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
