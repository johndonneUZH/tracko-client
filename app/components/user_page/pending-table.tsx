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
        <div className="flex flex-col items-start justify-center h-screen pt-10 px-4">
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
        <div className="flex flex-col px-4 h-full">
          <Input
            placeholder="Search pending requests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-2xl mx-auto mb-4"
          />
          <div className="flex-1 max-w-2xl mx-auto w-full">
          {filteredSent.length === 0 ? (
  <div className="bg-gray-50 border border-gray-200 text-gray-600 p-4 rounded text-center space-y-4">
    No pending friend requests
  </div>
) : (
  <div className="flex flex-col flex-grow h-full">
  <ScrollArea className="h-full w-full rounded-md flex-grow border">
    <table className="w-full table-auto">
      <tbody>
        {filteredSent.map((user) => (
          <tr key={user.id} className="transition-colors">
            <td className="px-1 py-2 text-left w-1">
              <Avatar className="h-6 w-6 rounded-md">
                <AvatarImage
                  src={
                    user.avatarUrl ||
                    `https://avatar.vercel.sh/${user.username}`
                  }
                />
              </Avatar>
            </td>
            <td className="text-left w-full px-1">
              {user.name || user.username}
            </td>
            <td className="px-1 py-2 align-middle">
              <div className="flex space-x-2">
                <button
                  onClick={handleAcceptRequest(user.id)}
                  className="p-1 rounded-full hover:cursor-pointer transition-colors"
                  aria-label="Accept"
                >
                  <Check className="h-4 w-4 text-green-600" />
                </button>
                <button
                  onClick={handleDeclineRequest(user.id)}
                  className="p-1 rounded-full hover:cursor-pointer transition-colors"
                  aria-label="Decline"
                >
                  <X className="h-4 w-4 text-red-600" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </ScrollArea>
  </div>
)}
          </div>
        </div>
      );
  }