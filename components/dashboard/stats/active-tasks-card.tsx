import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { TrendingUpIcon, ListTodoIcon } from "lucide-react"

// In the future, this function would fetch data from the database
async function getActiveTasksStats() {
  // Mock data - simulate database fetch
  await new Promise(resolve => setTimeout(resolve, 900))
  return {
    activeCount: 7,
    change: 2
  }
}

export async function ActiveTasksCard() {
  const stats = await getActiveTasksStats()
  
  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardDescription>Active Tasks</CardDescription>
        <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
          {stats.activeCount}
        </CardTitle>
        <div className="absolute right-4 top-4">
          <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
            <TrendingUpIcon className="size-3" />
            +{stats.change}
          </Badge>
        </div>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          <ListTodoIcon className="size-4" /> Automating your inbox
        </div>
      </CardFooter>
    </Card>
  )
}