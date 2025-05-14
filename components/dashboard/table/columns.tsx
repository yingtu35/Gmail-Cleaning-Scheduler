"use client"

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Task } from "@/types/task";


export const columns: ColumnDef<Task>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={ 
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
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
    id: "name",
    accessorKey: "formValues.name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <div>{row.original.formValues.name}</div>
    }
  },
  {
    id: "type",
    accessorKey: "formValues.occurrence.Occurrence",
    header: "Type",
    cell: ({ row }) => {
      return <div>{row.original.formValues.occurrence.Occurrence}</div>
    }
  },
  {
    accessorKey: "repeatCount",
    header: ({ column }) => {
      return (
        <div className="text-right">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Repeat Count
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => {
      return <div className="text-right pr-4">{row.original.repeatCount || 0}</div>
    }
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const expiresAt = row.original.expiresAt;
      const isExpired = expiresAt ? new Date(expiresAt) < new Date() : false;
      return (
        <div className={isExpired ? "text-red-500" : "text-green-500"}>
          {isExpired ? "Expired" : "Active"}
        </div>
      )
    },
    filterFn: (row, id, filterValue) => {
      const expiresAt = row.original.expiresAt;
      const isExpired = expiresAt ? new Date(expiresAt) < new Date() : false;
      
      // If filterValue is "Active", return true if not expired
      if (filterValue === "Active") return !isExpired;
      
      // If filterValue is "Expired", return true if expired
      if (filterValue === "Expired") return isExpired;
      
      // Default case: no filtering (should never reach here due to the dropdown values)
      return true;
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const task = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreHorizontal className="cursor-pointer" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <a href={`/tasks/${task.id}`}>View</a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <a href={`/tasks/${task.id}/edit`}>Edit</a>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-500">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]
