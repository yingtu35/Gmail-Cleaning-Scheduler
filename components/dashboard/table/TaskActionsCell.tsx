"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { MoreHorizontal } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  DestructiveAlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Task } from "@/types/task";
import { deleteTask } from "@/actions/task";

interface TaskActionsCellProps {
  task: Task;
}

export function TaskActionsCell({ task }: TaskActionsCellProps) {
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDeleteClick = async () => {
    toast.promise(deleteTask(task.id), {
      loading: `Deleting task ${task.formValues.name}...`,
      success: () => {
        // Server-side revalidation will handle the UI update.
        return `Task ${task.formValues.name} deleted successfully!`;
      },
      error: (error) => {
        return (
          error.message || "Error deleting task. Please try again later."
        );
      },
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreHorizontal className="cursor-pointer" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/tasks/${task.id}`}>View</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={`/tasks/${task.id}/edit`}>Edit</Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setDeleteDialogOpen(true)} // Open dialog
            className="text-red-500 cursor-pointer"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete the task?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone and will delete all associated data
              for task &quot;{task.formValues.name}&quot;.
              <br />
              If you are sure, please click the delete button below.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <DestructiveAlertDialogAction onClick={handleDeleteClick}>
              Delete
            </DestructiveAlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
} 