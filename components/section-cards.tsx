import { Suspense } from "react"

import { StatCardSkeleton } from "@/components/dashboard/stats/stat-card-skeleton"
import { EmailsDeletedCard } from "@/components/dashboard/stats/emails-deleted-card"
import { NextTaskCard } from "@/components/dashboard/stats/next-task-card"
import { TaskSuccessCard } from "@/components/dashboard/stats/task-success-card"
import { ActiveTasksCard } from "@/components/dashboard/stats/active-tasks-card"

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
