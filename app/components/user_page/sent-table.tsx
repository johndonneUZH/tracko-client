/* eslint-disable */

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types/user";
import { ApiService } from "@/api/apiService";
import { Avatar, AvatarImage } from "@/components/commons/avatar";
import { Input } from "@/components/commons/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { X } from "lucide-react";


interface UserData {
  id: string;
  friendRequestsSentIds: string[];
  username: string;
}

export default function SentRequestsTable() {
  const apiService = new ApiService();
  const router = useRouter();
  const [sentRequests, setSentRequests] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedUserId = sessionStorage.getItem("userId");

    if (!storedUserId) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        const [currentUser, allUsers] = await Promise.all([
          apiService.getUser<User>(storedUserId),
          apiService.getUsers<User[]>(),
        ]);

        const sentRequestUsers = allUsers.filter((user) =>
          currentUser.friendRequestsSentIds.includes(user.id)
        );

        setSentRequests(sentRequestUsers);
      } catch (err) {
        console.error("Error fetching sent friend requests:", err);
        setError("Failed to load sent friend requests");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const filteredSent = useMemo(() => {
    return sentRequests.filter((user) =>
      (user.name || user.username)
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [sentRequests, searchTerm]);

  function handleCancelRequest(friendId: string) {
    return async () => {
      try {
        setLoading(true);
        const storedUserId = sessionStorage.getItem("userId");

        if (!storedUserId) {
          router.push("/login");
          return;
        }

        await apiService.cancelFriendRequest(storedUserId, friendId);
        setSentRequests((prev) =>
          prev.filter((user) => user.id !== friendId)
        );
        toast.success("Friend request canceled successfully!");
      } catch (err) {
        console.error("Error canceling friend request:", err);
        setError("Failed to cancel friend request");

        toast.error("Failed to cancel the friend request.");
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
      <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded h-full w-full flex items-center justify-center">
        {error}
      </div>
    );
  }

  if (filteredSent.length === 0) {
    return (
      <div className="flex flex-col h-full w-full items-center justify-center px-4">
        <Input
          placeholder="Search sent requests..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md mb-4"
        />
        <div className="bg-gray-50 border border-gray-200 text-gray-600 p-4 rounded">
          No sent friend requests
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full px-4">
      <div className="flex flex-col flex-grow">
        <Input
          placeholder="Search sent requests..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full mb-4"
        />
        <ScrollArea className="flex-grow w-full rounded-md border">
          <div className="min-w-full">
            <table className="w-full table-auto">
              <tbody>
                {filteredSent.map((user) => (
                  <tr key={user.id} className="last:border-b-0">
                    <td className="px-2 py-2 text-left w-1">
                      <Avatar className="h-6 w-6 rounded-md">
                        <AvatarImage
                          src={
                            user.avatarUrl ||
                            `https://avatar.vercel.sh/${user.username}`
                          }
                        />
                      </Avatar>
                    </td>
                    <td className="text-left whitespace-nowrap">
                      {user.name || user.username}
                    </td>
                    <td className="px-2 py-1 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={handleCancelRequest(user.id)}
                          className="text-gray-600 hover:cursor-pointer hover:underline text-sm"
                        >
                          <X className="h-4 w-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}