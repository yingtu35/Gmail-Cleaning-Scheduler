import { LoadingSpinner } from "@/components/ui/loadingSpinner"

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen w-full">
      <LoadingSpinner />
    </div>
  )
}