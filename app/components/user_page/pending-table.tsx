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

  export default function PendingRequestsTable() {
    const apiService = new ApiService();
    const router = useRouter();
    const [incomingRequests, setIncomingRequests] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());

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
    }, [router]);
  
    const filteredSent = useMemo(() => {
      return incomingRequests.filter((user) =>
        (user.name || user.username)
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
    
      
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-full w-full">
          <div className="flex space-x-2">
            <div className="h-4 w-4 bg-blue-700 rounded-full animate-bounce"></div>
            <div className="h-4 w-4 bg-blue-800 rounded-full animate-bounce delay-200"></div>
            <div className="h-4 w-4 bg-blue-900 rounded-full animate-bounce delay-400"></div>
          </div>
        </div>
      );
    }
  
    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded">
          {error}
        </div>
      );
    }
    return (
      <div className="flex flex-col h-full w-full px-4 py-6 space-y-4">
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
      <tbody>
        {filteredSent.map((user) => (
          <tr key={user.id} className="hover:bg-gray-50 transition-colors">
            <td className="px-2 py-1 text-left w-1"></td>
            <td className="px-2 py-1 text-left w-1">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={
                    user.avatarUrl ||
                    `https://avatar.vercel.sh/${user.username}`
                  }
                />
              </Avatar>
            </td>
            <td className="px-2 py-1 text-left w-full">
              {user.name || user.username}
            </td>
            <td className="px-2 py-1">
              <div className="flex space-x-2">
                <button
                  onClick={handleAcceptRequest(user.id)}
                  className="p-2 rounded-full hover:bg-green-100 hover:cursor-pointer transition-colors"
                  aria-label="Accept"
                >
                  <Check className="h-5 w-5 text-green-600" />
                </button>
                <button
                  onClick={handleDeclineRequest(user.id)}
                  className="p-2 rounded-full hover:bg-red-100 hover:cursor-pointer transition-colors"
                  aria-label="Decline"
                >
                  <X className="h-5 w-5 text-red-600" />
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