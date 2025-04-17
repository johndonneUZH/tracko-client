/* eslint-disable */

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types/user";
import { ApiService } from "@/api/apiService";
import { Avatar, AvatarImage } from "@/components/commons/avatar";
import { Input } from "@/components/commons/input";
import { ScrollArea } from "@/components/ui/scroll-area";

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
          apiService.get<UserData>(`/users/${storedUserId}`),
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

  if (filteredSent.length === 0) {
    return (
      <div className="space-y-4 max-w-2xl mx-auto">
        <Input
          placeholder="Search sent requests..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
        <div className="bg-gray-50 border border-gray-200 text-gray-600 p-4 rounded">
          No sent friend requests
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <Input
        placeholder="Search sent requests..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full"
      />
      <ScrollArea className="h-52 w-full rounded-md border">
        <table className="w-full">
          <tbody>
            {filteredSent.map((user) => (
              <tr key={user.id}>
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
                <td className="px-2 py-1 text-right w-1">
                  <span
                    className={`h-3 w-3 rounded-full inline-block ${
                      user.status === "ONLINE" ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollArea>
    </div>
  );
}
