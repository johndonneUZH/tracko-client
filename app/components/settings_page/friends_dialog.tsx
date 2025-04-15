/* eslint-disable */

import { Button } from "@/components/commons/button"
import { useState } from "react";
import { User } from "@/types/user";
import { Checkbox } from "@/components/project_browser/checkbox";
import { Input } from "@components/commons/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/project_browser/dialog"

import {
    UserPlus,
} from "lucide-react"

import {
    Avatar,
    AvatarImage,
} from "@/components/commons/avatar"

interface Props {
    friends: User[]
    onAddFriends: (selected: User[]) => void;
} 

export function FriendsDialog({ friends, onAddFriends}: Props) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFriendIds, setSelectedFriendIds] = useState<Set<string>>(new Set());

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

    const handleAddFriends = () => {
        const selectedFriends = friends.filter(friend => selectedFriendIds.has(friend.id));
        onAddFriends(selectedFriends);
    };

    const filteredFriends = friends.filter((friend) => {
      const name = friend.name || friend.username;
      return name.toLowerCase().includes(searchTerm.toLowerCase());
    });
  
    return (
      <div className="max-h-100">
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
              <DialogDescription>
                Select friends to add to your new project.
              </DialogDescription>
            </DialogHeader>
  
            <div className="mb-4">
              <Input
                type="text"
                placeholder="Search friends..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
  
            <table className="w-full">
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
  
            <DialogFooter>
              <DialogClose asChild>
                <Button type="submit" onClick={handleAddFriends}>Select</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }