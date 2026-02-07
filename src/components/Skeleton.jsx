import React from "react";

const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={`animate-pulse bg-gray-700/50 rounded-md ${className}`}
      {...props}
    />
  );
};

export { Skeleton };
