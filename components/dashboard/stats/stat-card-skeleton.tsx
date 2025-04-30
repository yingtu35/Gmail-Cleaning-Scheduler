import {
  Card,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"

export function StatCardSkeleton() {
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