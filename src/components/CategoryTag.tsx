import React from 'react';

interface CategoryTagProps {
  label: string;
  className?: string;
}

const CategoryTag: React.FC<CategoryTagProps> = ({ label, className = '' }) => {
  return (
    <span className={`inline-block px-2 py-0.5 rounded bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider ${className}`}>
      {label}
    </span>
  );
};

export default CategoryTag;
