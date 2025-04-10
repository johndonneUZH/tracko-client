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
                <tr className="bg-gray-100 even:bg-transparent">
                    <td className="px-4 py-2 text-left"><University/></td>
                    <td className="px-4 py-2 text-left">Sopra</td>
                    <td className="px-4 py-2 text-left">Contributor</td>
                    <td className="px-4 py-2 text-left">11</td>
                </tr>
                <tr className="bg-gray-100 even:bg-transparent">
                    <td className="px-4 py-2 text-left"><Brain/></td>
                    <td className="px-4 py-2 text-left">Tracko</td>
                    <td className="px-4 py-2 text-left">Admin</td>
                    <td className="px-4 py-2 text-left">5</td>
                </tr>
                <tr className="bg-gray-100 even:bg-transparent">
                    <td className="px-4 py-2 text-left"><Apple/></td>
                    <td className="px-4 py-2 text-left">Apple</td>
                    <td className="px-4 py-2 text-left">Contributor</td>
                    <td className="px-4 py-2 text-left">52</td>
                </tr>
            </tbody>
        </table>
    )
}