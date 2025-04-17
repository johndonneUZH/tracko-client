/* eslint-disable */

import { useState } from "react";
import { User } from "@/types/user";
import { Button } from "@/components/commons/button";
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
  DialogClose,
} from "@/components/project_browser/dialog";

import { UserMinus, X } from "lucide-react";

import {
  Avatar,
  AvatarImage,
} from "@/components/commons/avatar";
import { useUserProjects } from "@/lib/browser_utils/useProjectStorage";
import { toast } from "sonner";

interface Props {
  members: User[];
  onAddMembers: () => void;
  ownerId: string | undefined;
}

export function KickDialog({ members, onAddMembers, ownerId }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMemberIds, setSelectedMemberIds] = useState<Set<string>>(new Set());
  const userId = sessionStorage.getItem("userId") || "";
  const { removeFriends } = useUserProjects(userId);

  const toggleMember = (id: string) => {
    setSelectedMemberIds((prev) => {
      const updated = new Set(prev);
      if (updated.has(id)) {
        updated.delete(id);
      } else {
        updated.add(id);
      }
      return updated;
    });
  };

  const handleRemoveMembers = async () => {
    const idsToRemove = Array.from(selectedMemberIds);
    try {
      console.log("Removing members with IDs:", idsToRemove);
      await removeFriends(idsToRemove);
      await onAddMembers();
      toast.success("Members successfully removed from the project.");
    } catch (error) {
      toast.error("Failed to add friends to the project.");
      console.error(error);
    }
  };    

  const filteredMembers = members.filter((member) => {
    const name = member.name || member.username;
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const selectedMembers = members.filter((member) => selectedMemberIds.has(member.id));

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="min-w-25 w-auto py-3" variant="destructive">
            <UserMinus />
            Kick Members
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Kick Members</DialogTitle>
            <DialogDescription>Select members to remove from your project.</DialogDescription>
          </DialogHeader>

          <div className="mb-4">
            <Input
              type="text"
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          {selectedMembers.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center space-x-2 px-3 py-1 rounded-full bg-gray-100 text-sm"
                >
                  <Avatar className="h-5 w-5">
                    <AvatarImage
                      src={
                        member.avatarUrl ||
                        `https://avatar.vercel.sh/${member.username}`
                      }
                    />
                  </Avatar>
                  <span>{member.name || member.username}</span>
                  <button
                    onClick={() => toggleMember(member.id)}
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
                {filteredMembers
                  .filter((member) => member.id !== ownerId)
                  .map((member) => (
                    <tr key={member.id}>
                      <td className="px-2 py-1 text-left w-1">
                        <Avatar className="h-8 w-8 rounded-lg">
                          <AvatarImage
                            src={
                              member.avatarUrl ||
                              `https://avatar.vercel.sh/${member.username}`
                            }
                          />
                        </Avatar>
                      </td>
                      <td className="px-2 py-1 text-left w-full">
                        {member.name || member.username}
                      </td>
                      <td className="px-2 py-1 text-right w-1">
                        <Checkbox
                          checked={selectedMemberIds.has(member.id)}
                          onCheckedChange={() => toggleMember(member.id)}
                        />
                      </td>
                    </tr>
                  ))}
                {filteredMembers.filter((m) => m.id !== ownerId).length === 0 && (
                  <tr>
                    <td colSpan={3} className="text-center text-sm py-2 text-gray-500">
                      No members found.
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
              <Button type="submit" onClick={handleRemoveMembers} variant="destructive">
                Remove
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
