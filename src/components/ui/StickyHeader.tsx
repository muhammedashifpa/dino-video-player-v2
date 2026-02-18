import React from 'react';
import { useInView } from 'motion/react';

interface StickyHeaderProps {
  children: React.ReactNode;
  stickyClassName?: string;
  defaultClassName?: string;
}

const StickyHeader: React.FC<StickyHeaderProps> = ({ 
  children, 
  stickyClassName = 'bg-white/95 dark:bg-background-dark/95 backdrop-blur-xl border-b border-black/5 dark:border-white/5 shadow-lg',
  defaultClassName = 'bg-transparent'
}) => {
  const sentinelRef = React.useRef(null);
  const isSticky = !useInView(sentinelRef, { amount: 1 });

  return (
    <>
      <div ref={sentinelRef} className="absolute -top-1 left-0 right-0 h-1 pointer-events-none" />
      <div className={`sticky top-0 z-30 transition-all duration-300 mb-2 ${
        isSticky ? stickyClassName : defaultClassName
      }`}>
        {children}
      </div>
    </>
  );
};

export default StickyHeader;
