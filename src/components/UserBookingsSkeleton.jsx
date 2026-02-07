import React from "react";
import { Skeleton } from "./Skeleton";

export const UserBookingsSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
             <div className="space-y-2">
                <Skeleton className="h-8 w-48 bg-gray-800" />
                <Skeleton className="h-4 w-64 bg-gray-800" />
             </div>
             <Skeleton className="h-10 w-32 rounded-lg bg-gray-800" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 h-96 flex flex-col">
                    <Skeleton className="h-40 w-full bg-gray-800" />
                    <div className="p-5 flex-1 space-y-4">
                        <Skeleton className="h-4 w-3/4 bg-gray-700" />
                        <Skeleton className="h-4 w-1/2 bg-gray-700" />
                        <div className="space-y-2 mt-4">
                            <Skeleton className="h-3 w-full bg-gray-700" />
                            <Skeleton className="h-3 w-5/6 bg-gray-700" />
                        </div>
                    </div>
                     <div className="p-4 border-t border-gray-700">
                        <Skeleton className="h-10 w-full rounded-lg bg-gray-700" />
                     </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};
