import { useEffect, useState } from "react";
import { User } from "@/types/user";
import { Button } from "@/components/commons/button";
import { Checkbox } from "@/components/project_browser/checkbox";
import { Input } from "@components/commons/input";
import { toast } from "sonner";
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { ApiService } from "@/api/apiService";
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
import { UserPlus, X } from "lucide-react";
import {
  Avatar,
  AvatarImage,
} from "@/components/commons/avatar";

type AllUsersDialogProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  users?: User[];
  onSelect?: (user: User) => void;
  children: React.ReactNode;
};

export function AllUsersDialog({
  open,
  onOpenChange,
  users: externalUsers,
  onSelect,
  children,
}: AllUsersDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [friends, setFriends] = useState<User[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const apiService = new ApiService();
  const [parent] = useAutoAnimate();

  const usingExternalUsers = !!externalUsers;

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
  }, []);
  

  const toggleUser = (id: string) => {
    setSelectedUserIds((prev) => {
      const updated = new Set(prev);
      updated.has(id) ? updated.delete(id) : updated.add(id);
      return updated;
    });
  };

  const handleAddUsers = async () => {
    if (onSelect && externalUsers) {
      const selected = externalUsers.find((u) => selectedUserIds.has(u.id));
      if (selected) {
        onSelect(selected);
      }
      return;
    }

    if (!currentUserId) return;
    try {
      const ids = Array.from(selectedUserIds);
      await Promise.all(ids.map(id => apiService.sendFriendRequest(currentUserId, id)));
      toast.success("Friend requests sent.");
      setSelectedUserIds(new Set());
    } catch (error) {
      toast.error("Failed to send friend requests.");
      console.error(error);
    }
  };

  const usersToRender = externalUsers ?? allUsers;

  const filteredUsers = usersToRender.filter((user) => {
    const name = user.name || user.username;
    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      user.id !== currentUserId &&
      !friends.find((f) => f.id === user.id)
    );
  });

  const selectedUsers = filteredUsers.filter((user) => selectedUserIds.has(user.id));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Users</DialogTitle>
          <DialogDescription>Search and send friend requests to new users.</DialogDescription>
        </DialogHeader>

        <Input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />

        {selectedUsers.length > 0 && (
          <div className="flex flex-wrap gap-2 my-2" ref={parent}>
            {selectedUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center space-x-2 px-3 py-1 rounded-full bg-gray-100 text-sm"
              >
                <Avatar className="h-5 w-5">
                  <AvatarImage src={user.avatarUrl || `https://avatar.vercel.sh/${user.username}`} />
                </Avatar>
                <span>{user.name || user.username}</span>
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

        <div className="relative max-h-64 overflow-y-auto pr-1">
          <table className="w-full">
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  onClick={() => toggleUser(user.id)}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  <td className="px-2 py-1 text-left w-1">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={user.avatarUrl || `https://avatar.vercel.sh/${user.username}`}
                      />
                    </Avatar>
                  </td>
                  <td className="px-2 py-1 text-left w-full">
                    {user.name || user.username}
                  </td>
                  <td className="px-2 py-1 text-right w-1">
                    <Checkbox checked={selectedUserIds.has(user.id)} />
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center text-sm py-2 text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" onClick={handleAddUsers}>
              Send Requests
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
