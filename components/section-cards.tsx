import { Suspense } from "react"

import {
  Card,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"

import { EmailsDeletedCard } from "@/components/dashboard/stats/emails-deleted-card"
import { NextTaskCard } from "@/components/dashboard/stats/next-task-card"
import { TaskSuccessCard } from "@/components/dashboard/stats/task-success-card"
import { ActiveTasksCard } from "@/components/dashboard/stats/active-tasks-card"

function StatCardSkeleton() {
  return (
    <Card className="@container/card">
      <CardHeader className="relative min-h-[5.5rem]">
        <div className="h-5 w-32 bg-muted rounded animate-pulse mb-2"></div>
        <div className="h-8 w-24 bg-muted rounded animate-pulse"></div>
        <div className="absolute right-4 top-4">
          <div className="h-6 w-16 bg-muted rounded animate-pulse"></div>
        </div>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1 text-sm min-h-[3.5rem]">
        <div className="h-5 w-40 bg-muted rounded animate-pulse"></div>
        <div className="h-4 w-32 bg-muted rounded animate-pulse"></div>
      </CardFooter>
    </Card>
  )
}

export function SectionCards() {
  return (
    <div className="*:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4 grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
      <Suspense fallback={<StatCardSkeleton />}>
        <EmailsDeletedCard />
      </Suspense>
      
      <Suspense fallback={<StatCardSkeleton />}>
        <NextTaskCard />
      </Suspense>
      
      <Suspense fallback={<StatCardSkeleton />}>
        <TaskSuccessCard />
      </Suspense>
      
      <Suspense fallback={<StatCardSkeleton />}>
        <ActiveTasksCard />
      </Suspense>
    </div>
  )
}
