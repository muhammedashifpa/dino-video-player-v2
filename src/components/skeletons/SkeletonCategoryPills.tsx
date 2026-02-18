import React from 'react';

const SkeletonCategoryPills: React.FC = () => {
  return (
    <div
      className="flex gap-2 p-3 overflow-x-hidden whitespace-nowrap z-20"
    >
      {[140, 240, 180, 245, 170].map((width, index) => (
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
