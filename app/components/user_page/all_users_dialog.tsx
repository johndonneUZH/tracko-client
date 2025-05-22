/* eslint-disable */

import React, { useEffect, useState } from "react";
import { User } from "@/types/user";
import { Button } from "@/components/commons/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@components/commons/input";
import { toast } from "sonner";
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { ApiService } from "@/api/apiService";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { UserPlus, X } from "lucide-react";
import {
  Avatar,
  AvatarImage,
} from "@/components/commons/avatar";

type AllUsersDialogProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  users?: User[];
  triggerReload: () => void;
  onSelect?: (user: User) => void;
  children: React.ReactNode;
  reload: boolean;
};

export function AllUsersDialog({
  open,
  onOpenChange,
  users: externalUsers,
  onSelect,
  triggerReload,
  reload,
  children,
}: AllUsersDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [friends, setFriends] = useState<User[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isSendingRequests, setIsSendingRequests] = useState(false);
  const apiService = new ApiService();
  const [parent] = useAutoAnimate();
  const [incomingRequests, setIncomingRequests] = useState<User[]>([]);
  const router = useRouter();
  const [sentRequests, setSentRequests] = useState<User[]>([]);

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    setCurrentUserId(userId);
  
    if (!userId) return;
  
    const fetchFriends = async () => {
      try {
        const fr = await apiService.getFriends<User[]>(userId);
        setFriends(fr);
      } catch (err) {
        toast.error("Failed to fetch friends.");
        console.error(err);
      }
    };
  
    fetchFriends();
  }, [reload]);

  useEffect(() => {
    const fetchData = async () => {
      const storedUserId = sessionStorage.getItem("userId");
      if (!storedUserId) {
        router.push("/login");
        return;
      }
  
      try {
        const [currentUser, allUsers] = await Promise.all([
          apiService.getUser<User>(storedUserId),
          apiService.getUsers<User[]>(),
        ]);
  
        const incomingIds = currentUser.friendRequestsIds || [];
        const sentIds = currentUser.friendRequestsSentIds || [];
  
        const incomingUsers = await Promise.all(
          incomingIds.map((id) => apiService.getUser<User>(id))
        );
        setIncomingRequests(incomingUsers);
  
        const sentRequestUsers = allUsers.filter(user =>
          sentIds.includes(user.id)
        );
        setSentRequests(sentRequestUsers);
  
        const incomingSet = new Set(incomingIds);
        const sentSet = new Set(sentIds);
  
        const filteredUsers = allUsers.filter(user =>
          !incomingSet.has(user.id) && !sentSet.has(user.id)
        );
  
        setAllUsers(filteredUsers);
      } catch (err) {
        console.error("Error fetching users and requests:", err);
        toast.error("Failed to load users or friend requests");
      }
    };
  
    fetchData();
  }, [router, reload]);

  const toggleUser = (id: string) => {
    setSelectedUserIds((prev) => {
      const updated = new Set(prev);
      updated.has(id) ? updated.delete(id) : updated.add(id);
      return updated;
    });
  };

  const handleAddUsers = async () => {
    if (!currentUserId || selectedUserIds.size === 0) return;
  
    setIsSendingRequests(true);
    const userIds = Array.from(selectedUserIds);
    const successfulRequests: string[] = [];
    const failedRequests: {userId: string, error: string}[] = [];
  
    try {
      // Process requests sequentially to avoid race conditions
      for (const userId of userIds) {
        try {
          await apiService.sendFriendRequest(currentUserId, userId);
          successfulRequests.push(userId);
        } catch (error) {
          failedRequests.push({
            userId,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
          console.error(`Failed to send request to ${userId}:`, error);
        }
      }
  
      if (successfulRequests.length > 0) {
        toast.success(`Sent ${successfulRequests.length} friend request(s)`);
      }
  
      if (failedRequests.length > 0) {
        toast.error(`Failed to send ${failedRequests.length} request(s)`);
        failedRequests.forEach(f => {
          console.error(`Request to ${f.userId} failed:`, f.error);
        });
      }
  
      setSelectedUserIds(new Set());
      if (onOpenChange) onOpenChange(false);

      triggerReload()
      
    } catch (error) {
      toast.error("Unexpected error occurred");
      console.error(error);
    } finally {
      setIsSendingRequests(false);
    }
  };

  const filteredUsers = searchTerm.trim() === ""
    ? []
    : allUsers.filter((user) => {
        const name = user.username;
        return (
          name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          user.id !== currentUserId &&
          !friends.some(f => f.id === user.id)
        );
      });

  const selectedUsers = allUsers.filter(user => selectedUserIds.has(user.id));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Friends</DialogTitle>
          <DialogDescription>
            Search users and send friend requests
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />

          {selectedUsers.length > 0 && (
            <div className="flex flex-wrap gap-2" ref={parent}>
              {selectedUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center space-x-2 px-3 py-1 rounded-full bg-gray-100 text-sm"
                >
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={user.avatarUrl || `https://avatar.vercel.sh/${user.username}`} />
                  </Avatar>
                  <span>{user.username}</span>
                  <button
                    onClick={() => toggleUser(user.id)}
                    className="hover:text-red-500"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="rounded-md max-h-64 overflow-y-auto">
            {filteredUsers.length > 0 ? (
              <table className="w-full">
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      onClick={() => toggleUser(user.id)}
                      className="cursor-pointer"
                    >
                      <td className="py-1 px-2 flex items-center space-x-3">
                        <Avatar className="h-8 w-8 rounded-md">
                          <AvatarImage
                            src={user.avatarUrl || `https://avatar.vercel.sh/${user.username}`}
                          />
                        </Avatar>
                        <div>
                          <div>{user.username}</div>
                        </div>
                      </td>
                      <td className="py-1 px-2 text-right">
                        <Checkbox 
                          checked={selectedUserIds.has(user.id)} 
                          onChange={() => toggleUser(user.id)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-4 text-center text-sm text-gray-500">
                {searchTerm ? "No users found" : "Start typing to search for users"}
              </div>
            )}
            <div
              className="sticky bottom-0 left-0 right-0 h-6 z-10 pointer-events-none"
              style={{
                background: "linear-gradient(to top, white, transparent)",
              }}
            />
          </div>
        </div>

        <DialogFooter>
        <div className="flex justify-end w-full items-center">
          <div className="flex items-center space-x-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button 
              onClick={handleAddUsers}
              disabled={selectedUserIds.size === 0 || isSendingRequests}
            >
              {isSendingRequests ? (
                "Sending..."
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Send Requests
                </>
              )}
            </Button>
          </div>
        </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}