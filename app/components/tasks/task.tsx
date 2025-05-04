"use client"

import { useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

import { FormValues, Task as TaskType } from "@/app/lib/definitions"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { deleteTask } from "@/app/lib/actions"
import { ScheduleDetail } from "@/components/task/detail/schedule-detail"
import { TaskDetail } from "@/components/task/detail/task-detail"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"


import { SectionWrapper } from "@/components/task/sectionWrapper"
import { InfoDetail } from "@/components/task/detail/info-detail"
import { PingWrapper } from "@/components/ui/ping-wrapper"
import { ChevronDownIcon } from "lucide-react"

interface StatusAndActionsGroupProps {
  taskId: string
  onDeleteTask: () => void
}
function StatusAndActionsGroup({
  taskId,
  onDeleteTask,
}: StatusAndActionsGroupProps) {
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)
  return (
    <div className="flex justify-end items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            Actions
            <ChevronDownIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Pause</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={`/tasks/${taskId}/edit`}>Edit</Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDeleteDialogOpen(true)}>
            <span className="text-red-500 hover:text-red-700">Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete the task?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone and will delete all associated data.
              <br />
              If you are sure, please click the delete button below.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={onDeleteTask}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default function Task({ task }: { task: TaskType }) {
  const router = useRouter()

  const { createdAt, updatedAt } = task
  const taskId = task.id as string
  const formValues: FormValues = task.formValues

  const { name, description, ...restFormValues } = formValues
  const aggregatedEntries = Object.entries(restFormValues)
  // extract the first 3 entries
  const scheduleEntries = aggregatedEntries.slice(0, 3)
  const taskEntries = aggregatedEntries.slice(3)

  const informationEntries = Object.entries({
    ["Description"]: description,
    ["Created Date"]: createdAt ? new Date(createdAt).toLocaleString() : "N/A",
    ["Updated Date"]: updatedAt ? new Date(updatedAt).toLocaleString() : "N/A",
  })

  const onDeleteTask = async () => {
    toast.promise(
      deleteTask(taskId),
      {
        loading: `Deleting task ${formValues.name}...`,
        success: () => {
          router.replace('/');
          return `Task ${formValues.name} deleted successfully!`;
        },
        error: (error) => {
          return error.message || "Error deleting task. Please try again later.";
        },
      }
    )
  }
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4 py-2">
          <h1 className="text-2xl font-bold">{name}</h1>
          <PingWrapper status="active">
            <Badge variant="outline">
              Active
            </Badge>
          </PingWrapper>
        </div>
        <StatusAndActionsGroup
          taskId={taskId}
          onDeleteTask={onDeleteTask}
        />
      </div>
      <SectionWrapper title="Information">
        <InfoDetail infoEntries={informationEntries} />
      </SectionWrapper>
      <Tabs defaultValue="detail">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="detail">Detail</TabsTrigger>
          <TabsTrigger value="stats" disabled className="cursor-not-allowed">Stats (Coming Soon)</TabsTrigger>
        </TabsList>
        <TabsContent value="detail" className="space-y-4">
          <SectionWrapper title="Schedule Detail">
            <ScheduleDetail scheduleEntries={scheduleEntries} />
          </SectionWrapper>
          <SectionWrapper title="Task Detail">
            <TaskDetail taskEntries={taskEntries} />
          </SectionWrapper>
        </TabsContent>
        <TabsContent value="stats" className="space-y-4">
          <SectionWrapper title="Statistics">
            <p>Your statistics component will go here.</p>
          </SectionWrapper>
        </TabsContent>
      </Tabs>
    </div>
  )
}