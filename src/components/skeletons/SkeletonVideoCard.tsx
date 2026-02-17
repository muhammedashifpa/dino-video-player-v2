import React from 'react';

const SkeletonVideoCard: React.FC = () => {
  return (
    <div className="flex flex-col gap-3 py-4">
      {/* Thumbnail Skeleton */}
      <div className="aspect-video w-full bg-gray-200 dark:bg-gray-700 animate-pulse relative" />

      <div className="flex gap-3 items-start px-2">
        {/* Avatar Skeleton */}
        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse shrink-0" />

        <div className="flex flex-col gap-2 w-full">
          {/* Title Skeleton */}
          <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />

          {/* Metadata Skeleton */}
          <div className="h-3 w-1/3 rounded bg-gray-200 dark:bg-gray-700 animate-pulse mt-1" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonVideoCard;
