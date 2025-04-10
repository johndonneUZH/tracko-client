import React from "react";

import {
    Avatar,
    AvatarImage,
} from "@/components/commons/avatar"

export function FriendsTable() {

    return (
        <table className="w-full">
            <tbody>
<<<<<<<< HEAD:app/components/ui/profile/friends-table.tsx
                <tr className="even:bg-gray-100">
                    <td className="px-2 py-2 text-left w-1">
                        <Avatar className="h-6 w-6 rounded-lg">
========
                <tr className="even:bg-transparent bg-gray-100">
                    <td className="px-2 py-1 text-left w-1">
                        <Avatar className="h-8 w-8 rounded-lg">
>>>>>>>> 49cc0026cd237939ab54eae25965739b2c8cd1d7:app/components/user_page/friends-table.tsx
                            <AvatarImage src={"https://avatar.vercel.sh/jill"} />
                        </Avatar>
                    </td>
                    <td className="px-2 py-1 text-left w-full">Mark Zuckerberg</td>
                    <td className="px-2 py-1 text-right w-1">
                        <span className="h-3 w-3 rounded-full bg-green-500 inline-block"></span>
                    </td>
                </tr>
<<<<<<<< HEAD:app/components/ui/profile/friends-table.tsx
                <tr className="even:bg-gray-100">
                    <td className="px-2 py-2 text-left w-1">
                        <Avatar className="h-6 w-6 rounded-lg">
========
                <tr className="even:bg-transparent bg-gray-100">
                    <td className="px-2 py-1 text-left w-1">
                        <Avatar className="h-8 w-8 rounded-lg">
>>>>>>>> 49cc0026cd237939ab54eae25965739b2c8cd1d7:app/components/user_page/friends-table.tsx
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
