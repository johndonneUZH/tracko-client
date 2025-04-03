/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, Trash2, CirclePlus } from "lucide-react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Type definition for the Project
export type Project = {
  id: number;
  name: string;
  lastModified: string;
};

const columns: ColumnDef<Project>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllRowsSelected() ||
          (table.getIsSomeRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "lastModified",
    header: "Last Modified",
    cell: ({ row }) => {
      const lastModified = "2025-03-04";
      const date = new Date(lastModified);
      return <div>{date.toLocaleString()}</div>;
    },
  },
];

export default function UserProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [nextId, setNextId] = useState(101);
  const [newProjectName, setNewProjectName] = useState("");
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false); // Dialog open state
  const [selectedProjectIds, setSelectedProjectIds] = useState<number[]>([]); // Track selected project IDs for deletion

  const handleAddProject = () => {
    const trimmedName = newProjectName.trim();

    if (!trimmedName) {
      setError("Project name cannot be empty.");
      return; // Stop execution if the name is empty
    }

    setError(""); // Clear any previous error message

    const newProject: Project = {
      id: nextId,
      name: trimmedName,
      lastModified: new Date().toISOString(),
    };

    setProjects([...projects, newProject]);
    setNextId(nextId + 1);
    setNewProjectName(""); // Clear the input field
    setDialogOpen(false); // Close the dialog after adding the project
  };

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: projects,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const handleDeleteSelected = () => {
    const validSelectedProjectIds = Object.keys(rowSelection).map((rowId) => {
      const project = projects[Number(rowId)];
      return project ? project.id : null;
    }).filter((id): id is number => id !== null);

    setSelectedProjectIds(validSelectedProjectIds); // Update the selected projects for deletion
  };

  const handleConfirmDelete = () => {
    const remainingProjects = projects.filter(
      (project) => !selectedProjectIds.includes(project.id)
    );

    setProjects(remainingProjects);
    setRowSelection({});
    setSelectedProjectIds([]); // Reset selected projects after deletion
  };

  return (
    <SidebarProvider>
      <div className="flex justify-center items-center min-h-screen">
        <AppSidebar />
        <SidebarInset className="flex-1 max-w-7xl px-4">
          <header className="flex h-16 shrink-0 items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-xl font-bold">Projects</h1>
          </header>

          <div className="flex flex-col items-center p-8">
            {/* Add Project Button */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="h-10 flex items-center gap-2">
                  <CirclePlus className="w-5 h-5" />
                  Create Project
                </Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Project</DialogTitle>
                  <DialogDescription>
                    Please enter the name of the project.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Enter project name"
                    value={newProjectName}
                    onChange={(e) => {
                      setNewProjectName(e.target.value);
                      setError(""); // Clear error message when user types
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault(); // Prevents accidental form submission
                        handleAddProject();
                      }
                    }}
                    className="w-full"
                  />
                  {error && <p className="text-red-500 text-sm">{error}</p>} {/* Error message */}
                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddProject}>Add</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <div className="w-full mt-8">
              <div className="flex items-center py-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="ml-auto">
                      Columns <ChevronDown />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {table
                      .getAllColumns()
                      .filter((column) => column.getCanHide())
                      .map((column) => (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                          }
                        >
                          {column.id}
                        </DropdownMenuCheckboxItem>
                      ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="rounded-md border overflow-x-auto">
                <Table className="min-w-full">
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
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
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
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

              {/* Pagination Controls */}
              <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  Next
                </Button>
              </div>

              {/* Delete Button */}
              <div className="flex justify-end py-4">
                <Button
                  variant="destructive"
                  onClick={handleDeleteSelected}
                  disabled={Object.keys(rowSelection).length === 0}
                >
                  <Trash2 className="mr-2" />
                  Delete Selected
                </Button>
              </div>
            </div>
          </div>

          {/* Alert Dialog for Deletion */}
          <AlertDialog open={selectedProjectIds.length > 0} onOpenChange={() => setSelectedProjectIds([])}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete {selectedProjectIds.length} project(s).
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirmDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
