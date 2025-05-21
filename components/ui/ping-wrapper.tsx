import React from "react";

import { TaskStatus } from "@/types/task";
import { taskStatusPingBackgroundColorMap, taskStatusPingForegroundColorMap } from "@/components/constants";

interface PingWrapperProps {
  children: React.ReactNode;
  status?: TaskStatus;
}

export const PingWrapper: React.FC<PingWrapperProps> = ({ children, status = "active" }) => {
  const backgroundColor = taskStatusPingBackgroundColorMap[status as keyof typeof taskStatusPingBackgroundColorMap] || "bg-green-400";
  const foregroundColor = taskStatusPingForegroundColorMap[status as keyof typeof taskStatusPingForegroundColorMap] || "bg-green-500";
  return (
    <div className="relative inline-flex items-center">
      {children}
      <span className="absolute -top-1 -right-1 flex size-3">
        <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${backgroundColor}`}></span>
        <span className={`relative inline-flex size-3 rounded-full ${foregroundColor}`}></span>
      </span>
    </div>
  );
};
