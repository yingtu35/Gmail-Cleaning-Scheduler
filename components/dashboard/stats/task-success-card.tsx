import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { TrendingUpIcon, CheckCircleIcon } from "lucide-react"

// In the future, this function would fetch data from the database
async function getTaskSuccessStats() {
  // Mock data - simulate database fetch
  await new Promise(resolve => setTimeout(resolve, 1200))
  return {
    successRate: 96.7,
    percentChange: 1.2,
    failedTasks: 2
  }
}

export async function TaskSuccessCard() {
  const stats = await getTaskSuccessStats()
  
  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardDescription>Task Success Rate</CardDescription>
        <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
          {stats.successRate}%
        </CardTitle>
        <div className="absolute right-4 top-4">
          <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
            <TrendingUpIcon className="size-3" />
            +{stats.percentChange}%
          </Badge>
        </div>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          <CheckCircleIcon className="size-4" /> High reliability
        </div>
        <div className="text-muted-foreground">
          {stats.failedTasks} failed tasks this month
        </div>
      </CardFooter>
    </Card>
  )
}