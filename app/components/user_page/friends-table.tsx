import React from "react";

import {
    Avatar,
    AvatarImage,
} from "@/components/commons/avatar"

export function FriendsTable() {

    return (
        <table className="w-full">
            <tbody>
                <tr className="border-b border-gray-300 even:bg-gray-100">
                    <td className="px-2 py-1 text-left w-1">
                        <Avatar className="h-8 w-8 rounded-lg">
                            <AvatarImage src={"https://avatar.vercel.sh/jill"} />
                        </Avatar>
                    </td>
                    <td className="px-2 py-1 text-left w-full">Mark Zuckerberg</td>
                    <td className="px-2 py-1 text-right w-1">
                        <span className="h-3 w-3 rounded-full bg-green-500 inline-block"></span>
                    </td>
                </tr>
                <tr className="border-b border-gray-300 even:bg-gray-100">
                    <td className="px-2 py-1 text-left w-1">
                        <Avatar className="h-8 w-8 rounded-lg">
                            <AvatarImage src={"https://avatar.vercel.sh/jane"} />
                        </Avatar>
                    </td>
                    <td className="px-2 py-1 text-left w-full">Elon Musk</td>
                    <td className="px-2 py-1 text-right w-1">
                        <span className="h-3 w-3 rounded-full bg-red-500 inline-block"></span>
                    </td>
                </tr>
            </tbody>
        </table>
    )
}
