import React from "react";

interface PingWrapperProps {
  children: React.ReactNode;
  status?: "active" | "new" | "alert";
}

const statusColorMap = {
  active: "green",
  new: "sky",
  alert: "red",
};

export const PingWrapper: React.FC<PingWrapperProps> = ({ children, status = "active" }) => {
  const color = statusColorMap[status] || "green";
  return (
    <div className="relative inline-flex items-center">
      {children}
      <span className="absolute -top-1 -right-1 flex size-3">
        <span className={`absolute inline-flex h-full w-full animate-ping rounded-full bg-${color}-400 opacity-75`}></span>
        <span className={`relative inline-flex size-3 rounded-full bg-${color}-500`}></span>
      </span>
    </div>
  );
};
