import { cn } from "@/libs/utils";

export function FormControlBarWrapper({
  className,
  children
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("sticky top-0 bg-white flex flex-wrap items-center justify-between p-4 z-10 shadow", className)}>
      {children}
    </div>
  );
}