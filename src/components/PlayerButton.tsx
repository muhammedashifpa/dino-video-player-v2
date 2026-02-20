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
      whileTap={{ scale: isLarge ? 0.95 : 0.9 }}
      className={`rounded-full flex items-center justify-center border text-white transition-all pointer-events-auto ${baseClasses} ${className}`}
      {...props}
    >
      <span className={`material-symbols-outlined ${isLarge ? 'text-4xl' : 'text-2xl'} ${isActive ? 'filled-icon' : ''} ${iconClassName}`}>
        {icon}
      </span>
    </motion.button>
  );
};

export default PlayerButton;
