import React from 'react';


const categories = ['All', 'AI Technology', 'Income Streams', 'Music', 'Gaming', 'Live', 'News'];


const CategoryPills: React.FC = () => {
  return (
    <div
      className="flex gap-2 p-3 overflow-x-auto whitespace-nowrap bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md z-20 scrollbar-none"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      <style>{`
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      {categories.map((category, index) => (
        <button
          key={category}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
            index === 0
              ? 'bg-slate-900 text-white dark:bg-white dark:text-black border-transparent'
              : 'bg-gray-100 text-slate-700 border-gray-200 hover:bg-gray-200 dark:bg-surface-dark dark:text-slate-300 dark:border-border-dark dark:hover:bg-surface-dark/80 dark:hover:text-white'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};


export default CategoryPills;
