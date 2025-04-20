"use client"

import * as React from "react"
import { useState } from "react"
import {
  ColumnDef,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

import { Button } from "@/components/commons/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/project_browser/table"
import { User } from "@/types/user"
import { Change } from "@/types/change"

import {
  Avatar,
  AvatarImage,
} from "@/components/commons/avatar"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/commons/select"

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/commons/pagination"

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Alice Johnson",
    username: "alicej",
    email: "alice@example.com",
    password: "hashed",
    status: "active",
    projectIds: ["1", "2"],
    createAt: "2024-01-01T12:00:00Z",
    lastLoginAt: "2025-04-18T15:30:00Z",
    friendsIds: [],
    friendRequestsIds: [],
    friendRequestsSentIds: [],
    avatarUrl: "https://avatar.vercel.sh/alicej",
    birthday: "1995-06-21",
    bio: "Passionate product designer.",
  },
  {
    id: "2",
    name: "Bob Smith",
    username: "bobsmith",
    email: "bob@example.com",
    password: "hashed",
    status: "active",
    projectIds: ["1"],
    createAt: "2023-08-12T10:00:00Z",
    lastLoginAt: "2025-04-17T08:45:00Z",
    friendsIds: [],
    friendRequestsIds: [],
    friendRequestsSentIds: [],
    avatarUrl: "https://avatar.vercel.sh/bobsmith",
    birthday: "1988-03-14",
    bio: "Loves building things.",
  },
]

export const mockChanges: Change[] = [
  {
    projectId: "1",
    ownerId: "1",
    changeType: "ADDED_IDEA",
    changeDescription: "Added idea",
    createdAt: "2025-04-18T14:30:00Z",
  },
  {
    projectId: "1",
    ownerId: "2",
    changeType: "EDITED_IDEA",
    changeDescription: "Edited idea",
    createdAt: "2025-04-17T10:15:00Z",
  },
  {
    projectId: "1",
    ownerId: "1",
    changeType: "DELETED_IDEA",
    changeDescription: "Deleted idea",
    createdAt: "2025-04-16T09:00:00Z",
  },
  {
    projectId: "1",
    ownerId: "1",
    changeType: "UPVOTED_IDEA",
    changeDescription: "Upvoted idea",
    createdAt: "2025-04-15T18:45:00Z",
  },
  {
    projectId: "1",
    ownerId: "2",
    changeType: "DOWNVOTED_IDEA",
    changeDescription: "Downvoted idea",
    createdAt: "2025-04-14T13:20:00Z",
  },
]

const enhancedChanges = mockChanges.map((change) => {
  const user = mockUsers.find((u) => u.id === change.ownerId)
  return {
    ...change,
    username: user?.username ?? "Unknown",
    avatarUrl: user?.avatarUrl ?? "",
  }
})

export const columns: ColumnDef<typeof enhancedChanges[0]>[] = [
  {
    accessorKey: "username",
    header: "Author",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Avatar className="h-6 w-6 rounded-sm">
          <AvatarImage src={row.original.avatarUrl || "https://avatar.vercel.sh/john"} />
        </Avatar>
        <span>{row.original.username}</span>
      </div>
    ),
  },
  {
    accessorKey: "changeDescription",
    header: "Description",
    cell: ({ row }) => <div>{row.getValue("changeDescription")}</div>,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Timestamp
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"))
      return (
        <div>
          {date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: false,
          })}
        </div>
      )
    },
  },
]

export function ChangesTable() {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [selectedUserId] = useState("")
  const [selectedAuthor, setSelectedAuthor] = useState("all")
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  })

  const table = useReactTable({
    data: enhancedChanges,
    columns,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnVisibility,
      pagination,
    },
    globalFilterFn: (row) => {
      const matchUser = selectedUserId ? row.original.ownerId === selectedUserId : true
      return matchUser
    },
  })

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex flex-wrap items-center gap-4 py-4">
        <Select
            value={selectedAuthor}
            onValueChange={(value) => {
                setSelectedAuthor(value)
                table.getColumn("username")?.setFilterValue(value === "all" ? undefined : value)
            }}
        >
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by author" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All Authors</SelectItem>
                    {mockUsers.map((user) => (
                <SelectItem key={user.id} value={user.username}>
                    {user.username}
                </SelectItem>
                ))}
            </SelectContent>
        </Select>
      </div>
      <div>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-start py-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => table.previousPage()}
                className={table.getCanPreviousPage() ? "" : "opacity-50 pointer-events-none"}
              />
            </PaginationItem>
            <PaginationItem>
              <div className="px-2 text-sm text-muted-foreground">
                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              </div>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={() => table.nextPage()}
                className={table.getCanNextPage() ? "" : "opacity-50 pointer-events-none"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}