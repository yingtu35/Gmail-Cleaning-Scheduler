import React from "react";

import { TaskStatus } from "@/types/task";
import { taskStatusPingBackgroundColorMap, taskStatusPingForegroundColorMap } from "@/components/constants";

interface PingWrapperProps {
  children: React.ReactNode;
  status?: TaskStatus;
}

export const PingWrapper: React.FC<PingWrapperProps> = ({ children, status = "active" }) => {
  return (
    <div className="relative inline-flex items-center">
      {children}
      <span className="absolute -top-1 -right-1 flex size-3">
        <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${taskStatusPingBackgroundColorMap[status as keyof typeof taskStatusPingBackgroundColorMap]}`}></span>
        <span className={`relative inline-flex size-3 rounded-full ${taskStatusPingForegroundColorMap[status as keyof typeof taskStatusPingForegroundColorMap]}`}></span>
      </span>
    </div>
  );
};
