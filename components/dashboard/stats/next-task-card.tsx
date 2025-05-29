import { CalendarIcon } from "lucide-react"

import { getNextScheduledTask } from "@/libs/actions"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { NextScheduledTask } from "@/types/task"
import { getTimeUntil } from "@/utils/date"

async function getNextTaskStats(): Promise<NextScheduledTask | null> {
  const task = await getNextScheduledTask();
  if (!task) {
    return null;
  }
  return task;
}

function NoNextScheduledTaskCard() {
  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardDescription>Next Scheduled Task</CardDescription>
        <CardTitle className="@[250px]/card:text-2xl text-xl font-semibold"></CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">No next scheduled task</p>
      </CardContent>
    </Card>
  )
}

export async function NextTaskCard() {
  const nextTask = await getNextTaskStats();
  if (!nextTask) {
    return <NoNextScheduledTaskCard />;
  }
  
  const { id: taskId, formValues, nextExecutedAt } = nextTask;
  const { name: scheduledTaskName } = formValues;

  if (!nextExecutedAt) {
    return <NoNextScheduledTaskCard />;
  }

  const timeUntil = getTimeUntil(nextExecutedAt, new Date());
  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardDescription>Next Scheduled Task</CardDescription>
        <CardTitle className="@[250px]/card:text-2xl text-xl font-semibold">
          {scheduledTaskName}
        </CardTitle>
        <div className="absolute right-4 top-4">
          <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
            <CalendarIcon className="size-3" />
            In {timeUntil}
          </Badge>
        </div>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          <CalendarIcon className="size-4" /> {nextExecutedAt.toLocaleString()}
        </div>
        <div className="text-muted-foreground">
          <a href={`/tasks/${taskId}`} className="text-primary hover:underline">View task details</a>
        </div>
      </CardFooter>
    </Card>
  )
}