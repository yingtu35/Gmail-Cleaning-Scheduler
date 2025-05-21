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
import { taskStatusEnum } from "@/models/schema";
import { taskStatusColorMap } from "@/components/constants";


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
    accessorKey: "successCounts",
    header: ({ column }) => {
      return (
        <div className="text-right">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Success Counts
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => {
      return <div className="text-right pr-4">{row.original.successCounts || 0}</div>
    }
  },
  {
    accessorKey: "errorCounts",
    header: ({ column }) => {
      return (
        <div className="text-right">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Error Counts
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => {
      return <div className="text-right pr-4">{row.original.errorCounts || 0}</div>
    }
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      if (!row.original.status) {
        return <div>N/A</div>
      }
      const statusColor = taskStatusColorMap[row.original.status as keyof typeof taskStatusColorMap] || "green";
      const shownStatus = row.original.status.charAt(0).toUpperCase() + row.original.status.slice(1);
      return (
        <div className={`text-${statusColor}-500`}>{shownStatus}</div>
      )
    },
    filterFn: (row, id, filterValue) => {
      // If filterValue is one of the statuses, return true if the status matches
      if (taskStatusEnum.enumValues.includes(filterValue)) {
        return row.original.status === filterValue;
      }
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
