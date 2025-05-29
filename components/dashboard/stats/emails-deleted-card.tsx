import { Trash, TrashIcon } from "lucide-react"

import { getTotalEmailsDeleted } from "@/libs/actions"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

async function getEmailsDeletedStats() {
  const totalEmailsDeleted = await getTotalEmailsDeleted();
  return {
    total: totalEmailsDeleted,
  }
}

export async function EmailsDeletedCard() {
  const stats = await getEmailsDeletedStats()
  const { total } = stats;
  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardDescription>Gmails Deleted</CardDescription>
        <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
          {total.toLocaleString()}
        </CardTitle>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          {total === 0 ? (
            <>
              <Trash className="size-4" /> Let&apos;s start deleting emails!
            </>
          ) : (
            <>
              <TrashIcon className="size-4" /> Keep up the good work!
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}