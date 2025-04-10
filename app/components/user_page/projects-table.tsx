import React from "react";

import {
    University,
    Apple,
    Brain
} from "lucide-react"

export function ProjectsTable() {

    return (
        <table className="w-full">
            <thead>
                <tr>
                    <th className="px-4 py-2 text-left font-bold">Icon</th>
                    <th className="px-4 py-2 text-left font-bold">Name</th>
                    <th className="px-4 py-2 text-left font-bold">Role</th>
                    <th className="px-4 py-2 text-left font-bold">Members</th>
                </tr>
            </thead>
            <tbody>
<<<<<<<< HEAD:app/components/ui/profile/projects-table.tsx
                <tr className="even:bg-gray-100">
========
                <tr className="bg-gray-100 even:bg-transparent">
>>>>>>>> 49cc0026cd237939ab54eae25965739b2c8cd1d7:app/components/user_page/projects-table.tsx
                    <td className="px-4 py-2 text-left"><University/></td>
                    <td className="px-4 py-2 text-left">Sopra</td>
                    <td className="px-4 py-2 text-left">Contributor</td>
                    <td className="px-4 py-2 text-left">11</td>
                </tr>
<<<<<<<< HEAD:app/components/ui/profile/projects-table.tsx
                <tr className="even:bg-gray-100">
========
                <tr className="bg-gray-100 even:bg-transparent">
>>>>>>>> 49cc0026cd237939ab54eae25965739b2c8cd1d7:app/components/user_page/projects-table.tsx
                    <td className="px-4 py-2 text-left"><Brain/></td>
                    <td className="px-4 py-2 text-left">Tracko</td>
                    <td className="px-4 py-2 text-left">Admin</td>
                    <td className="px-4 py-2 text-left">5</td>
                </tr>
<<<<<<<< HEAD:app/components/ui/profile/projects-table.tsx
                <tr className="even:bg-gray-100">
========
                <tr className="bg-gray-100 even:bg-transparent">
>>>>>>>> 49cc0026cd237939ab54eae25965739b2c8cd1d7:app/components/user_page/projects-table.tsx
                    <td className="px-4 py-2 text-left"><Apple/></td>
                    <td className="px-4 py-2 text-left">Apple</td>
                    <td className="px-4 py-2 text-left">Contributor</td>
                    <td className="px-4 py-2 text-left">52</td>
                </tr>
            </tbody>
        </table>
    )
}
