import { motion } from 'motion/react';
import SkeletonCategoryPills from './skeletons/SkeletonCategoryPills';

interface CategoryPillsProps {
  categories?: string[];
  isLoading?: boolean;
  selectedCategory?: string;
  onSelect?: (category: string) => void;
}

const CategoryPills: React.FC<CategoryPillsProps> = ({ 
  categories = [], 
  isLoading = false, 
  selectedCategory = 'All', 
  onSelect 
}) => {
  if (isLoading) {
    return <SkeletonCategoryPills />;
  }

  return (
    <div
      className="flex gap-2 p-3 overflow-x-auto whitespace-nowrap bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md z-20 scrollbar-none"
    >
      <motion.div
        className="flex gap-2"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.05,
            },
          },
        }}
      >
        {categories.map((category) => (
          <motion.button
            key={category}
            onClick={() => onSelect?.(category)}
            variants={{
              hidden: { opacity: 0, x: -10 },
              visible: { opacity: 1, x: 0 },
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
              category === selectedCategory
                ? 'bg-slate-900 text-white dark:bg-white dark:text-black border-transparent'
                : 'bg-gray-100 text-slate-700 border-gray-200 hover:bg-gray-200 dark:bg-surface-dark dark:text-slate-300 dark:border-border-dark dark:hover:bg-surface-dark/80 dark:hover:text-white'
            }`}
          >
            {category}
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
};


export default CategoryPills;
