/* eslint-disable */

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types/user";
import { ApiService } from "@/api/apiService";
import { Avatar, AvatarImage } from "@/components/commons/avatar";
import { Input } from "@/components/commons/input";
import { ScrollArea } from "@/components/ui/scroll-area";

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
      <div className="space-y-4 max-w-2xl mx-auto">
        <Input
          placeholder="Search pending requests..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
        <ScrollArea className="h-80 w-full rounded-md border">
          <table className="w-full">
            <tbody>
              {filteredSent.map((user) => (
                <tr key={user.id} className="border-b border-gray-100">
                  <td className="px-2 py-1 text-left w-1">
                   
                  </td>
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
                  <td className="px-2 py-1 space-x-2">
                    <button
                    
                      className="text-green-600 hover:underline text-sm"
                    >
                      Accept
                    </button>
                    <button
                     
                      className="text-red-600 hover:underline text-sm"
                    >
                      Decline
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollArea>
      </div>
    );
  }