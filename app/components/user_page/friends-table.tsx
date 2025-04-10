/* eslint-disable */

import React, { useEffect, useState } from "react";
import { ApiService } from "@/api/apiService"
import { useRouter } from "next/navigation";
import { User } from "@/types/user";

import {
    Avatar,
    AvatarImage,
} from "@/components/commons/avatar"

export function FriendsTable() {
    const apiService = new ApiService();
    const router = useRouter();
    const [friends, setFriends] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {   
    const storedUserId = sessionStorage.getItem("userId");
  
    if (!storedUserId) {
      router.push("/login");
      return;
    }
  
    setUserId(storedUserId);
  
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await apiService.getFriends<User[]>(storedUserId);
        setFriends(data);
      } catch (err) {
        setError("Failed to load projects");
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProjects();
    }, [router]);

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
    
    if (friends.length === 0) {
        return (
          <div className="bg-gray-50 border border-gray-200 text-gray-600 p-4 rounded">
            Go touch some grass, you have no friends
          </div>
        );
    }
    
    return (
        <table className="w-full">
            <tbody>
                {friends.map((friend) => (
                    <tr key={friend.id} className="even:bg-transparent bg-gray-100">
                        <td className="px-2 py-1 text-left w-1">
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage src={friend.avatarUrl || `https://avatar.vercel.sh/${friend.username}`} />
                            </Avatar>
                        </td>
                        <td className="px-2 py-1 text-left w-full">
                            {friend.name || friend.username}
                        </td>
                        <td className="px-2 py-1 text-right w-1">
                            <span className={`h-3 w-3 rounded-full inline-block ${
                                friend.status === "ONLINE" ? "bg-green-500" : "bg-red-500"
                            }`}></span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
