import { ListTodoIcon } from "lucide-react"

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getActiveTasksCount } from "@/libs/actions";

// In the future, this function would fetch data from the database
async function getActiveTasksStats() {
  const tasksCount = await getActiveTasksCount();
  return tasksCount;
}

export async function ActiveTasksCard() {
  const tasksCount = await getActiveTasksStats()
  
  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardDescription>Active Tasks</CardDescription>
        <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
          {tasksCount}
        </CardTitle>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          <ListTodoIcon className="size-4" /> Automating your inbox
        </div>
      </CardFooter>
    </Card>
  )
}