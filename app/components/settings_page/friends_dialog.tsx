/* eslint-disable */

import { useState } from "react";
import { User } from "@/types/user";
import { Button } from "@/components/commons/button";
import { Checkbox } from "@/components/project_browser/checkbox";
import { Input } from "@components/commons/input";
import { useUserProjects } from "@/lib/browser_utils/useProjectStorage";
import { toast } from "sonner";
import { MembersTable } from "@/components/settings_page/members_table";
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

interface Props {
  friends: User[];
  onAddFriends: () => void;
}

export function FriendsDialog({ friends, onAddFriends }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFriendIds, setSelectedFriendIds] = useState<Set<string>>(new Set());
  const userId = sessionStorage.getItem("userId") || "";
  const { addFriends } = useUserProjects(userId);

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

  const handleAddFriends = async () => {
    const idsToAdd = Array.from(selectedFriendIds);
    try {
      await addFriends(idsToAdd);
      await onAddFriends();
      toast.success("Friends successfully added to the project.");
    } catch (error) {
      toast.error("Failed to add friends to the project.");
      console.error(error);
    }
  };

  const filteredFriends = friends.filter((friend) => {
    const name = friend.name || friend.username;
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const selectedFriends = friends.filter((friend) => selectedFriendIds.has(friend.id));

  return (
    <div>
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
            <div className="flex flex-wrap gap-2">
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
                      <Checkbox
                        checked={selectedFriendIds.has(friend.id)}
                        onCheckedChange={() => toggleFriend(friend.id)}
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
            <Button type="button" onClick={handleAddFriends}>
                Select
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
