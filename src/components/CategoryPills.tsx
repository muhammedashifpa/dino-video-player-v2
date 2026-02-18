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
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              category === selectedCategory
                ? 'bg-primary text-white'
                : 'bg-black/5 text-slate-700 hover:bg-black/10 dark:bg-white/10 dark:text-slate-300 dark:hover:bg-white/20'
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
