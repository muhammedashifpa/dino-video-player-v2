import React from 'react';

const SkeletonCategoryPills: React.FC = () => {
  return (
    <div
      className="flex gap-2 p-3 overflow-x-hidden whitespace-nowrap z-20"
    >
      {[60, 80, 70, 90, 65, 75].map((width, index) => (
        <div
          key={index}
          className="h-8 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse"
          style={{ width: `${width}px` }}
        />
      ))}
    </div>
  );
};

export default SkeletonCategoryPills;
