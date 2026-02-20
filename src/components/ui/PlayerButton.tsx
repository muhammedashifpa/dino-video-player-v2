import React from 'react';
import { motion, type HTMLMotionProps } from 'motion/react';

interface PlayerButtonProps extends HTMLMotionProps<"button"> {
  icon: string;
  variant?: 'small' | 'large';
  iconClassName?: string;
  isActive?: boolean;
}

const PlayerButton: React.FC<PlayerButtonProps> = ({ 
  icon, 
  variant = 'small', 
  className = '', 
  iconClassName = '',
  isActive = false,
  ...props 
}) => {
  const isLarge = variant === 'large';
  
  const baseClasses = isLarge
    ? "w-20 h-20 bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:bg-white/20"
    : "w-12 h-12 bg-white/5 backdrop-blur-md border-white/10 shadow-lg drop-shadow-[0_0_8px_rgba(255,255,255,0.2)] hover:bg-white/10";

  return (
    <motion.button
      layout
      whileHover={{ 
        scale: 1.05, 
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        transition: { duration: 0.2 }
      }}
      whileTap={{ 
        scale: 0.88, 
        backgroundColor: '#ad2bee',
        borderColor: '#ad2bee',
        transition: { type: "spring", stiffness: 400, damping: 20 } 
      }}
      className={`relative rounded-full flex items-center justify-center border text-white transition-colors pointer-events-auto ${baseClasses} ${className}`}
      {...props}
    >
      <span className={`material-symbols-outlined ${isLarge ? 'text-4xl' : 'text-2xl'} ${isActive ? 'filled-icon' : ''} ${iconClassName} relative z-10`}>
        {icon}
      </span>
    </motion.button>
  );
};

export default PlayerButton;
