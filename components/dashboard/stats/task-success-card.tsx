import { CircleAlert, CheckCircleIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getTaskCountsStats } from "@/libs/actions";

// In the future, this function would fetch data from the database
async function getTasksStats() {
  const taskCountsStats = await getTaskCountsStats();
  if (!taskCountsStats) {
    return null;
  }
  return taskCountsStats;
}

function EmptyTaskSuccessCard() {
  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardDescription>Task Success Rate</CardDescription>
      </CardHeader>
      <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
        No data
      </CardTitle>
      <CardFooter className="flex-col items-start gap-1 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          We keep track of all your tasks execution history, so you can see how your tasks are performing.
        </div>
      </CardFooter>
    </Card>
  )
}

export async function TaskSuccessCard() {
  const stats = await getTasksStats()
  if (!stats) {
    return <EmptyTaskSuccessCard />
  }
  const { successCounts, errorCounts } = stats;
  const totalCounts = successCounts + errorCounts;

  const successRate = totalCounts > 0 ? `${Math.round((successCounts / totalCounts) * 100)}%` : "N/A";
  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardDescription>Task Success Rate</CardDescription>
        <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
          {successRate}
        </CardTitle>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          <CheckCircleIcon className="size-4" /> {successCounts} successful tasks
        </div>
        <div className="line-clamp-1 flex gap-2 font-medium">
          <CircleAlert className="size-4" /> {errorCounts} failed tasks
        </div>
      </CardFooter>
    </Card>
  )
}