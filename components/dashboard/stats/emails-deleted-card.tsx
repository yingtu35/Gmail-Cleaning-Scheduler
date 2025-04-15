import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { TrendingUpIcon, TrashIcon } from "lucide-react"

// In the future, this function would fetch data from the database
async function getEmailsDeletedStats() {
  // Mock data - simulate database fetch
  await new Promise(resolve => setTimeout(resolve, 1000))
  return {
    total: 12583,
    thisWeek: 347,
    percentChange: 21.8,
  }
}

export async function EmailsDeletedCard() {
  const stats = await getEmailsDeletedStats()
  
  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardDescription>Gmails Deleted</CardDescription>
        <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
          {stats.total.toLocaleString()}
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
          <TrashIcon className="size-4" /> {stats.thisWeek} deleted this week
        </div>
        <div className="text-muted-foreground">
          {stats.percentChange}% increase from last month
        </div>
      </CardFooter>
    </Card>
  )
}