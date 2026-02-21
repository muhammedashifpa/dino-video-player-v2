import React from 'react';
import { motion } from 'motion/react';

interface CloseButtonProps {
  onClick: (e: React.MouseEvent) => void;
  className?: string;
  title?: string;
}

const CloseButton: React.FC<CloseButtonProps> = ({ 
  onClick, 
  className = "", 
  title = "Close" 
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all cursor-pointer shadow-lg border border-white/10 ${className}`}
      title={title}
    >
      <span className="material-symbols-outlined text-2xl">close</span>
    </motion.button>
  );
};

export default CloseButton;
