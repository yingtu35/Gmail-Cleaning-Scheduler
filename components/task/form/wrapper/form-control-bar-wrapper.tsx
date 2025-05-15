import { cn } from "@/utils/cn";

export function FormControlBarWrapper({
  className,
  children,
  hide
}: {
  className?: string;
  children: React.ReactNode;
  hide?: boolean;
}) {
  return (
    <div
      className={cn(
        "sticky top-0 bg-white flex flex-wrap items-center justify-between p-4 z-10 shadow",
        "transition-transform duration-500 ease-in-out",
        hide ? "-translate-y-full" : "translate-y-0",
        className
      )}
    >
      {children}
    </div>
  );
}