import { LoaderCircle } from 'lucide-react';
import { cn } from '@/utils/cn';
export function Loader({
  className,
}: {
  className?: string;
}) {
  return (
    <LoaderCircle className={cn("w-4 h-4 animate-spin", className)} />
  )
}