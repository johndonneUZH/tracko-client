import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types/user";
import { ApiService } from "@/api/apiService";
import { Avatar, AvatarImage } from "@/components/commons/avatar";
import { Input } from "@/components/commons/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

export default function SentRequestsTable() {
  const apiService = new ApiService();
  const router = useRouter();
  const [sentRequests, setSentRequests] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const storedUserId = sessionStorage.getItem("userId");
    setCurrentUserId(storedUserId);

    if (!storedUserId) {
      router.push("/login");
      return;
    }
  }, [router]);

  useEffect(() => {
    if (!currentUserId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch both sent requests and all users in parallel
        const [currentUser, allUsers] = await Promise.all([
          apiService.getUser<User>(currentUserId),
          apiService.getUsers<User[]>(),
        ]);

        // Create a Set for faster lookups
        const sentRequestIds = new Set(currentUser.friendRequestsSentIds || []);
        
        // Filter users who are in the sent requests list
        const sentRequestUsers = allUsers.filter(user => 
          sentRequestIds.has(user.id)
        );

        setSentRequests(sentRequestUsers);
      } catch (err) {
        console.error("Error fetching sent friend requests:", err);
        setError("Failed to load sent friend requests");
        toast.error("Failed to load sent requests");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUserId]);

  const filteredSent = useMemo(() => {
    return sentRequests.filter((user) =>
      (user.name || user.username)
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [sentRequests, searchTerm]);

  async function handleCancelRequest(friendId: string) {
    if (!currentUserId) {
      router.push("/login");
      return;
    }

    try {
      setLoading(true);
      await apiService.cancelFriendRequest(currentUserId, friendId);
      
      // Optimistically update the UI
      setSentRequests(prev => prev.filter(user => user.id !== friendId));
      
      toast.success("Friend request canceled successfully!");
    } catch (err) {
      console.error("Error canceling friend request:", err);
      toast.error("Failed to cancel friend request");
    } finally {
      setLoading(false);
    }
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
    <div className="flex flex-col h-full w-full px-4 py-6 space-y-4">
      <div className="flex flex-col flex-grow">
        <Input
          placeholder="Search sent requests..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full mb-4"
        />

        {filteredSent.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 text-gray-600 p-4 rounded flex-grow flex items-center justify-center">
            {searchTerm ? "No matching requests found" : "You haven't sent any friend requests"}
          </div>
        ) : (
          <ScrollArea className="flex-grow w-full rounded-md border">
            <div className="min-w-full">
              <table className="w-full table-auto">
                <tbody>
                  {filteredSent.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 last:border-b-0">
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage
                              src={
                                user.avatarUrl ||
                                `https://avatar.vercel.sh/${user.username}`
                              }
                            />
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name || user.username}</p>
                            <p className="text-sm text-gray-500">
                              {user.status === "ONLINE" ? "Online" : "Offline"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end space-x-4">
                          
                          <button
                            onClick={() => handleCancelRequest(user.id)}
                            className="text-sm text-red-600 hover:text-red-800 hover:underline hover:cursor-pointer"
                            disabled={loading}
                          >
                            {loading ? "Canceling..." : "Cancel"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}