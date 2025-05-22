/* eslint-disable */

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types/user";
import { ApiService } from "@/api/apiService";
import { Avatar, AvatarImage } from "@/components/commons/avatar";
import { Input } from "@/components/commons/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import { useAutoAnimate } from "@formkit/auto-animate/react";

type Props = {
  reload: boolean;
  triggerReload: () => void;
};

  export default function PendingRequestsTable( {reload, triggerReload} : Props ) {
    const apiService = new ApiService();
    const router = useRouter();
    const [incomingRequests, setIncomingRequests] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
    const [parent, enableAnimations] = useAutoAnimate()

    const fetchSentRequests = async () => {
      const storedUserId = sessionStorage.getItem("userId");
      if (!storedUserId) {
        router.push("/login");
        return;
      }
      try {
        setLoading(true);
        const currentUser = await apiService.getUser<User>(storedUserId);
        const ids = currentUser.friendRequestsIds;
        const users = await Promise.all(
          ids.map((id) => apiService.getUser<User>(id))
        );
        setIncomingRequests(users);
      } catch (err) {
        console.error("Error fetching sent requests:", err);
        setError("Failed to load sent friend requests");
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchSentRequests();
    }, [router, reload]);
  
    const filteredSent = useMemo(() => {
      return incomingRequests.filter((user) =>
        (user.username)
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }, [incomingRequests, searchTerm]);
  
    const toggleUserSelection = (id: string) => {
      setSelectedUsers((prev) => {
        const newSet = new Set(prev);
        newSet.has(id) ? newSet.delete(id) : newSet.add(id);
        return newSet;
      });
    };

    function handleAcceptRequest(friendId: string) {
      return async () => {
        try {
          setLoading(true);
          const storedUserId = sessionStorage.getItem("userId");
          if (!storedUserId) {
            setError("User ID not found in session storage");
            return;
          }
          await apiService.acceptFriendRequest(storedUserId, friendId);
          await fetchSentRequests();
    
          toast.success("Friend request accepted!");
          triggerReload()
        } catch (err) {
          console.error("Error accepting friend request:", err);
          setError("Failed to accept friend request");
    
          toast.error("Failed to accept the friend request.");
        } finally {
          setLoading(false);
        }
      };
    }
    

    function handleDeclineRequest(friendId: string) {
      return async () => {
        try {
          setLoading(true);
          const storedUserId = sessionStorage.getItem("userId");
          if (!storedUserId) {
            setError("User ID not found in session storage");
            return;
          }
          await apiService.rejectFriendRequest(storedUserId, friendId);
          await fetchSentRequests();
    
          toast.success("Friend request declined.");
        } catch (err) {
          console.error("Error declining friend request:", err);
          setError("Failed to decline friend request");
    
          toast.error("Failed to decline the friend request.");
        } finally {
          setLoading(false);
        }
      };
    }
    
  
    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded">
          {error}
        </div>
      );
    }
    return (
      <div className="flex flex-col h-full w-full px-4 py-4 space-y-4">
          <Input
            placeholder="Search pending requests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full mb-4"
          />
          {filteredSent.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 text-gray-600 p-4 rounded flex-grow flex items-center justify-center">
    No pending friend requests
  </div>
) : (
  <ScrollArea className="h-full w-full rounded-md border">
    <table className="w-full">
      <tbody ref={parent}>
        {filteredSent.map((user) => (
          <tr key={user.id} className="transition-colors">
            <td className="px-2 py-1 text-left flex items-center gap-2">
              <Avatar className="h-6 w-6 rounded-md">
                <AvatarImage
                  src={
                    user.avatarUrl ||
                    `https://avatar.vercel.sh/${user.username}`
                  }
                />
              </Avatar>
              <span>{user.username}</span>
            </td>
            <td className="px-2 py-1">
              <div className="flex space-x-2 justify-end gap-2">
                <button
                  onClick={handleAcceptRequest(user.id)}
                  className="rounded-full hover:cursor-pointer text-green-600 hover:text-green-800 transition-colors bg-transparent"
                  aria-label="Accept"
                >
                  <Check className="h-5 w-5" />
                </button>
                <button
                  onClick={handleDeclineRequest(user.id)}
                  className="rounded-full hover:cursor-pointer text-red-600 hover:text-red-800 transition-colors bg-transparent"
                  aria-label="Decline"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </ScrollArea>
)}
          </div>
      );
  }