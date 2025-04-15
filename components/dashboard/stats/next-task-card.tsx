import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CalendarIcon } from "lucide-react"

// In the future, this function would fetch data from the database
async function getNextTaskStats() {
  // Mock data - simulate database fetch
  await new Promise(resolve => setTimeout(resolve, 800))
  return {
    taskName: "Clear Promotions",
    timeUntil: "8h",
    scheduledTime: "Tomorrow, 8:00 AM",
    taskId: "task-123"
  }
}

export async function NextTaskCard() {
  const stats = await getNextTaskStats()
  
  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardDescription>Next Scheduled Task</CardDescription>
        <CardTitle className="@[250px]/card:text-2xl text-xl font-semibold">
          {stats.taskName}
        </CardTitle>
        <div className="absolute right-4 top-4">
          <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
            <CalendarIcon className="size-3" />
            In {stats.timeUntil}
          </Badge>
        </div>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          <CalendarIcon className="size-4" /> {stats.scheduledTime}
        </div>
        <div className="text-muted-foreground">
          <a href={`/tasks/${stats.taskId}`} className="text-primary hover:underline">View task details</a>
        </div>
      </CardFooter>
    </Card>
  )
}