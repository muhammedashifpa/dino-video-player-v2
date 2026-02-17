import React from 'react';

const categories = ['All', 'AI Technology', 'Income Streams', 'Music', 'Gaming', 'Live', 'News'];

const CategoryPills: React.FC = () => {
  return (
    <div className="flex gap-2 p-3 overflow-x-auto whitespace-nowrap bg-background-light dark:bg-background-dark z-20 scrollbar-hide">
      {categories.map((category, index) => (
        <button
          key={category}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            index === 0
              ? 'bg-primary text-white'
              : 'bg-surface-dark/50 dark:bg-surface-dark border border-border-dark/30 text-slate-400 hover:bg-surface-dark/80 hover:text-white'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryPills;
