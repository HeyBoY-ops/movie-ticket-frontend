import React from "react";
import { Skeleton } from "./Skeleton";

export const OrganizationDashboardSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 md:p-12 space-y-8">
      {/* Header Skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-8 w-64 bg-gray-800" />
        <Skeleton className="h-4 w-96 bg-gray-800" />
      </div>

      {/* Stats Row Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-800 p-6 rounded-xl border border-gray-700 h-32 flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-24 bg-gray-700" />
              <Skeleton className="h-8 w-8 rounded-lg bg-gray-700" />
            </div>
            <Skeleton className="h-8 w-32 bg-gray-700" />
            <Skeleton className="h-3 w-40 bg-gray-700" />
          </div>
        ))}
      </div>

      {/* Charts & Tables Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2 bg-gray-800 p-6 rounded-xl border border-gray-700 h-96 space-y-4">
            <div className="flex justify-between">
                <Skeleton className="h-6 w-48 bg-gray-700" />
                <Skeleton className="h-8 w-32 bg-gray-700" />
            </div>
            <Skeleton className="w-full h-full rounded-lg bg-gray-700/50" />
        </div>

        {/* Theater List */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 h-96 space-y-4">
            <Skeleton className="h-6 w-40 bg-gray-700 mb-6" />
            {[1, 2, 3, 4].map((i) => (
                 <Skeleton key={i} className="h-16 w-full rounded-lg bg-gray-700" />
            ))}
        </div>
      </div>
    </div>
  );
};
