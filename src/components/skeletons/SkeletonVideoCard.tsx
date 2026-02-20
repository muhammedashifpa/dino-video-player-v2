import React from 'react';

const SkeletonVideoCard: React.FC = () => {
  return (
    <div className="flex flex-col mb-4">
      {/* Thumbnail Skeleton */}
      <div className="aspect-9/16 w-full bg-gray-200 dark:bg-gray-700 animate-pulse relative rounded-lg shadow-md" />

      <div className="flex flex-col px-1 mt-2">
        {/* Title Skeleton */}
        <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700 animate-pulse mb-1" />
        <div className="h-4 w-2/3 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />

        {/* Category Chip Skeleton */}
        <div className="h-5 w-16 rounded bg-gray-200 dark:bg-gray-700 animate-pulse mt-2" />
      </div>
    </div>
  );
};

export default SkeletonVideoCard;
