import { SectionWrapperSkeleton } from "@/components/task/sectionWrapper";
import { DetailSkeleton } from "@/components/task/detail/detail-skeleton";

export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4 py-2">
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
          <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
      </div>
      <SectionWrapperSkeleton>
        <DetailSkeleton />
      </SectionWrapperSkeleton>
      <div className="h-12 p-1 animate-pulse bg-gray-200 rounded" />
      <SectionWrapperSkeleton>
        <DetailSkeleton />
      </SectionWrapperSkeleton>
      <SectionWrapperSkeleton>
        <DetailSkeleton />
      </SectionWrapperSkeleton>
    </div>
  );
}