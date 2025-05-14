/* eslint-disable */

import React, { use, useEffect, useState } from "react";
import { User } from "@/types/user";
import { useRouter } from "next/navigation";
import { ApiService } from "@/api/apiService";
import { useAutoAnimate } from '@formkit/auto-animate/react'

import {
    Avatar,
    AvatarImage,
} from "@/components/commons/avatar"

interface Props {
    ownerId: string | undefined;
    members: User[];
}

export function MembersTable( { ownerId, members } : Props) {
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const apiService = new ApiService();
    const [parent, enableAnimations] = useAutoAnimate()
    
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
        <div className="space-y-6">
            
            <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {members
                    .filter((m) => m.id === ownerId)
                    .map((member) => (
                    <div key={member.id} className="flex items-start gap-3 p-3 border rounded-lg">
                        <Avatar className="h-10 w-10 rounded-md">
                        <AvatarImage
                            src={member.avatarUrl || `https://avatar.vercel.sh/${member.username}`}
                        />
                        </Avatar>
                        <div>
                        <div className="text-sm font-semibold text-gray-900">
                            {member.name || member.username}
                        </div>
                        <div className="text-xs text-muted-foreground">
                            @{member.username}
                        </div>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
            
            {members.length > 1 && (
            <div>
                <h3 className="text-sm font-semibold text-blue-700 bg-blue-100 rounded-full mb-2 px-2 py-1 w-min">Contributors</h3>
                <div 
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
                    ref={parent}
                >
                {members
                    .filter((m) => m.id !== ownerId)
                    .map((member) => (
                    <div key={member.id} className="flex items-start gap-3 p-3 border rounded-lg">
                        <Avatar className="h-10 w-10 rounded-md">
                        <AvatarImage
                            src={member.avatarUrl || `https://avatar.vercel.sh/${member.username}`}
                        />
                        </Avatar>
                        <div>
                        <div className="text-sm font-semibold text-gray-900">
                            {member.name || member.username}
                        </div>
                        <div className="text-xs text-muted-foreground">
                            @{member.username}
                        </div>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
            )}
        </div>
    );
}
