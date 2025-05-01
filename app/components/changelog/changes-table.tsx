/*eslint-disable */

"use client"

import * as React from "react"
import { useState, useEffect, useMemo } from "react"
import {
  ColumnDef,
  SortingState,
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
import { ApiService } from "@/api/apiService"
import { Change } from "@/types/change"
import { User } from "@/types/user"

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

interface EnhancedChange extends Change {
  username: string
  avatarUrl: string
}

export function ChangesTable() {
  const [projectId, setProjectId] = useState<string>("")
  const [changes, setChanges] = useState<Change[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ])
  const [selectedAuthor, setSelectedAuthor] = useState("all")

  // Initialize ApiService only once
  const apiService = useMemo(() => new ApiService(), [])

  useEffect(() => {
    const id = sessionStorage.getItem("projectId")
    if (!id) {
      setError("Project ID not found. Please re-login.")
      return
    }
    setProjectId(id)
  }, [])

  useEffect(() => {
    if (!projectId) return

    const fetchData = async () => {
      try {
        setLoading(true)
        
        const changesData = await apiService.get<Change[]>(`/projects/${projectId}/changes`)
        const userIds = [...new Set(changesData.map((change) => change.ownerId))]
        const usersData = await Promise.all(
          userIds.map(userId => apiService.get<User>(`/users/${userId}`))
        )
        
        setChanges(changesData)
        setUsers(usersData)
      } catch (err) {
        setError("Failed to fetch changes data")
        console.error("Fetch error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [projectId, apiService])

  const enhancedChanges = useMemo(() => {
    return changes.map((change) => {
      const user = users.find((u) => u.id === change.ownerId)
      return {
        ...change,
        username: user?.username ?? "Unknown",
        avatarUrl: user?.avatarUrl ?? "",
      }
    })
  }, [changes, users])

  const table = useReactTable({
    data: enhancedChanges,
    columns: [
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
    ],
    // Essential pagination configuration
    initialState: {
      pagination: {
        pageSize: 5,
      },
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
    },
    globalFilterFn: (row) => {
      const matchUser = selectedAuthor === "all" || row.original.username === selectedAuthor
      return matchUser
    },
  })

  if (loading) {
    return <div>Loading changes...</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

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
            {users.map((user) => (
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
                <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                  No changes found.
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
              <Button
                variant="ghost"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
            </PaginationItem>
            <PaginationItem>
              <div className="px-2 text-sm text-muted-foreground">
                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              </div>
            </PaginationItem>
            <PaginationItem>
              <Button
                variant="ghost"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}