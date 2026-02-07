import React from "react";
import { Skeleton } from "./Skeleton";

export const MovieCardSkeleton = () => {
  return (
    <div className="relative rounded-2xl overflow-hidden shadow-[0_0_25px_rgba(255,255,255,0.05)] border border-white/5">
      {/* Poster Skeleton */}
      <div className="w-full aspect-[2/3] bg-gray-800 animate-pulse" />
      
      {/* Overlay Content Skeleton (imitating the bottom content) */}
      <div className="absolute bottom-0 left-0 right-0 p-5 space-y-3">
        <Skeleton className="h-8 w-3/4 bg-gray-700" /> {/* Title */}
        
        <div className="flex gap-3">
            <Skeleton className="h-4 w-12 bg-gray-700" /> {/* Rating */}
            <Skeleton className="h-4 w-16 bg-gray-700" /> {/* Language */}
            <Skeleton className="h-4 w-12 bg-gray-700" /> {/* Duration */}
        </div>
        
        <div className="flex gap-2">
             <Skeleton className="h-6 w-16 rounded-full bg-gray-700" /> {/* Genre Badge */}
             <Skeleton className="h-6 w-16 rounded-full bg-gray-700" />
        </div>
      </div>
    </div>
  );
};
