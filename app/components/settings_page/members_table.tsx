/* eslint-disable */

import React, { useEffect, useState } from "react";
import { User } from "@/types/user";
import { useRouter } from "next/navigation";
import { ApiService } from "@/api/apiService";

import {
    Avatar,
    AvatarImage,
} from "@/components/commons/avatar"

interface Props {
    ownerId : String | undefined
}

export function MembersTable( { ownerId } : Props) {
    const [error, setError] = useState<string | null>(null);
    const [members, setMembers] = useState<User[]>([]);
    const router = useRouter();
    const apiService = new ApiService();

    useEffect(() => {
        const fetchMembersData = async () => {
          const projectId = sessionStorage.getItem("projectId");
          const token = sessionStorage.getItem("token");
      
          if (!projectId || !token) {
            router.push("/login");
            return;
          }
      
          try {
            const data = await apiService.get<User[]>(`/projects/${projectId}/members`)
            setMembers(data);
            console.log(data)
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        };
      
        fetchMembersData();
    }, []);

    if (error) {
        return (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded">
            {error}
          </div>
        );
      } 
    
    if (members.length === 0) {
        return (
          <div className="bg-gray-50 border border-gray-200 text-gray-600 p-4 rounded">
            Go touch some grass, you have no members
          </div>
        );
    }
    
    return (
        <table className="w-full table-fixed">
            <thead>
                <tr className="bg-gray-50">
                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Icon</th>
                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
            </thead>
            <tbody>
                {members.map((member) => (
                    <tr key={member.id} className="border-b">
                        <td className="px-2 py-1 text-left w-full">
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage src={member.avatarUrl || `https://avatar.vercel.sh/${member.username}`} />
                            </Avatar>
                        </td>
                        <td className="px-2 py-1 text-left w-full">
                            {member.name || member.username}
                        </td>
                        <td className="px-2 py-1 text-left w-full">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${ownerId === member.id ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                {ownerId === member.id ? 'Admin' : 'Contributor'}
                            </span>
                        </td>
                        <td className="px-2 py-1 text-left w-full">
                            <span className={`h-3 w-3 rounded-full inline-block ${
                                member.status === "ONLINE" ? "bg-green-500" : "bg-red-500"
                            }`}></span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
