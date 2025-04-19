/* eslint-disable */

import React, { useEffect, useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/project_browser/dialog";
import { ApiService } from "@/api/apiService";
import { useRouter } from "next/navigation";
import { User } from "@/types/user";
import {
  Avatar,
  AvatarImage,
} from "@/components/commons/avatar";
import { Input } from "@/components/commons/input";
import { CirclePlus } from "lucide-react";
import { Button } from "@/components/commons/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export function FriendsTable() {
  const apiService = new ApiService();
  const router = useRouter();
  const [friends, setFriends] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [newFriendUsername, setNewFriendUsername] = useState("");
  const [currentUsername, setCurrentUsername] = useState("");
  
  useEffect(() => {
    const storedUserId = sessionStorage.getItem("userId");

    if (!storedUserId) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [friendsData, usersData] = await Promise.all([
          apiService.getFriends<User[]>(storedUserId),
          apiService.getUsers<User[]>(),
        ]);
        setFriends(friendsData);
        setAllUsers(usersData);
        const currentUser = usersData.find((u) => u.id === storedUserId);
        if (currentUser) setCurrentUsername(currentUser.username);
      } catch (err) {
        setError("Failed to load data");
        console.error("Error fetching friends and users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const filteredFriends = useMemo(() => {
    return friends.filter((friend) =>
      (friend.name || friend.username)
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [friends, searchTerm]);

  const filteredUsers = useMemo(() => {
    if (!newFriendUsername.trim()) {
      return [];
    }

    return allUsers.filter(
      (user) =>
        user.username.toLowerCase().includes(newFriendUsername.toLowerCase()) &&
        user.username !== currentUsername && 
        !friends.some((f) => f.id === user.id)
    );
  }, [allUsers, newFriendUsername, currentUsername, friends]);

  function handleRequest() {
    if (newFriendUsername.trim() === "") return;
    const friend = filteredUsers[0];
    const storedUserId = sessionStorage.getItem("userId");
    if (friend && storedUserId) {
      apiService.sendFriendRequest(storedUserId, friend.id).then(() => {
        setNewFriendUsername("");
      });
    }
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
    <div className="space-y-4 max-w-2xl mx-auto">
      <Input
        placeholder="Search friends..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full"
      />
  
      {filteredFriends.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 text-gray-600 p-4 rounded">
          Go touch some grass, you have no friends
        </div>
      ) : (
        <ScrollArea className="h-52 w-full rounded-md border">
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
                    <span
                      className={`h-3 w-3 rounded-full inline-block ${
                        friend.status === "ONLINE"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    ></span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollArea>
      )}

      <div className="flex justify-end pt-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="h-10 flex items-center gap-2">
              <CirclePlus className="w-5 h-5" />
              Add Friends
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Friend</DialogTitle>
              <DialogDescription>Enter the friend's username.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <Input
                placeholder="Friend's username"
                className="w-full"
                value={newFriendUsername}
                onChange={(e) => setNewFriendUsername(e.target.value)}
              />

              <ScrollArea className="h-40 border rounded-md px-2 py-1">
                <div className="space-y-1">
                  {filteredUsers.length === 0 ? (
                    <div className="text-center text-gray-500">
                      No users found
                    </div>
                  ) : (
                    filteredUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between px-2 py-1 hover:bg-gray-100 rounded cursor-pointer"
                        onClick={() => setNewFriendUsername(user.username)} 
                      >
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage
                              src={
                                user.avatarUrl ||
                                `https://avatar.vercel.sh/${user.username}`
                              }
                            />
                          </Avatar>
                          <span>{user.name || user.username}</span>
                        </div>
                        <span className="text-xs text-gray-500">
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleRequest}>Add</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
