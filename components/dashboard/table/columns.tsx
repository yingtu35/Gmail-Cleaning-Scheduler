"use client"

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Task } from "@/types/task";
import { taskStatusEnum } from "@/models/schema";
import { taskStatusColorMap } from "@/components/constants";
import { capitalizeFirstLetter } from "@/utils/strings";

import { TaskActionsCell } from "./TaskActionsCell";

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
      const shownStatus = capitalizeFirstLetter(row.original.status);
      return (
        <div className={taskStatusColorMap[row.original.status as keyof typeof taskStatusColorMap]}>{shownStatus}</div>
      )
    },
    filterFn: (row, id, filterValue) => {
      if (taskStatusEnum.enumValues.includes(filterValue)) {
        return row.original.status === filterValue;
      }
      return true;
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <TaskActionsCell task={row.original} />;
    }
  }
]
