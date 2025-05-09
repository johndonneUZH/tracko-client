/* eslint-disable*/
import React, { useEffect, useState, useMemo } from "react";
import { ApiService } from "@/api/apiService";
import { useRouter } from "next/navigation";
import { User } from "@/types/user";
import { AllUsersDialog } from "@/components/user_page/all_users_dialog";
import {
  Avatar,
  AvatarImage,
} from "@/components/commons/avatar";
import { Input } from "@/components/commons/input";
import { UserPlus, Trash, X } from "lucide-react";
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
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [removing, setRemoving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [router]);

  async function fetchData() {
    const storedUserId = sessionStorage.getItem("userId");

    if (!storedUserId) {
      router.push("/login");
      return;
    }

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
  }

  const filteredFriends = useMemo(() => {
    return friends.filter((friend) =>
      (friend.name || friend.username).toLowerCase()
    );
  }, [friends]);

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

  async function handleRemoveSelected() {
    const storedUserId = sessionStorage.getItem("userId");
    if (!storedUserId || selectedFriends.length === 0) return;

    try {
      setRemoving(true);
      await Promise.all(
        selectedFriends.map((friendId) =>
          apiService.removeFriend(storedUserId, friendId)
        )
      );
      setSelectedFriends([]);
      await fetchData();
    } catch (err) {
      console.error("Error removing friends:", err);
    } finally {
      setRemoving(false);
    }
  }

  function toggleSelectFriend(id: string) {
    setSelectedFriends((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  }

  function toggleSelectAll() {
    if (selectedFriends.length === filteredFriends.length) {
      setSelectedFriends([]);
    } else {
      setSelectedFriends(filteredFriends.map((f) => f.id));
    }
  }

  function removeFriend(friendId: string) {
    return async () => {
      const storedUserId = sessionStorage.getItem("userId");
      if (!storedUserId) return;
  
      try {
        await apiService.removeFriend(storedUserId, friendId);
        await fetchData();
      } catch (err) {
        console.error(`Error removing friend ${friendId}:`, err);
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

  return (
    <div className="flex flex-col h-full w-full px-4">
      <div className="flex flex-col flex-grow">
        <div className="flex flex-row space-x-4 justify-center"> 
          <Input
            placeholder="Search friends..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full mb-4"
          />
          <div className="flex gap-4 justify-center">
            <AllUsersDialog
              open={isDialogOpen}
              onOpenChange={setIsDialogOpen}
              users={filteredUsers}
              onSelect={(user: User) => {
                const storedUserId = sessionStorage.getItem("userId");
                if (storedUserId && user) {
                  apiService.sendFriendRequest(storedUserId, user.id).then(() => {
                    setNewFriendUsername("");
                    setIsDialogOpen(false);
                  });
                }
              }}
            >
              <Button
                className="h-9 w-9 flex gap-2"
                onClick={() => setIsDialogOpen(true)}
              >
                <UserPlus className="w-4 h-4" />
              </Button>
            </AllUsersDialog>
          </div>
        </div>

        {filteredFriends.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 text-gray-600 p-4 rounded flex-grow flex items-center justify-center">
            Go touch some grass, you have no friends
          </div>
        ) : (
          <ScrollArea className="flex-grow w-full rounded-md border">
            <table className="w-full table-auto">
              <tbody>
                {filteredFriends.map((friend) => (
                  <tr key={friend.id}>
                    <td className="px-1 py-2 text-left flex items-center gap-2">
                      <Avatar className="h-6 w-6 rounded-md">
                        <AvatarImage
                          src={
                            friend.avatarUrl ||
                            `https://avatar.vercel.sh/${friend.username}`
                          }
                        />
                      </Avatar>
                      <span>{friend.name || friend.username}</span>
                    </td>
                    <td className="align-middle px-2 py-1 w-1">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={removeFriend(friend.id)}
                          aria-label="Close"
                          className="hover:cursor-pointer"
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
        )}
      </div>
    </div>
  );
}