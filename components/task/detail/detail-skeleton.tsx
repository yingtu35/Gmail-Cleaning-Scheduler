import React from "react";

export function DetailSkeleton() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i}>
          <div className="h-4 w-1/2 bg-gray-200 rounded mb-2 animate-pulse" />
          <div className="h-6 w-full bg-gray-300 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}
