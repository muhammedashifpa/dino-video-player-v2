import React from 'react';
import { motion } from 'motion/react';
import { usePlayerStore } from '../../store/usePlayerStore';

interface VerticalMiniPlayerViewProps {
  handlePlayPause: (e?: React.MouseEvent) => void;
}

const VerticalMiniPlayerView: React.FC<VerticalMiniPlayerViewProps> = ({ 
  handlePlayPause 
}) => {
  const { currentVideo, status, close } = usePlayerStore();

  if (!currentVideo) return null;

  return (
    <div className="relative w-full h-full flex items-center pr-4 gap-3 bg-white dark:bg-background-dark/80 backdrop-blur-none dark:backdrop-blur-md border-none box-content z-20">
       {/* Dynamic Spacer for the shared video element */}
       <div className="w-28 h-full shrink-0">
          {/* 
             The video container will animate here based on videoContainerVariants.mini.
             We leave this space empty but with specific dimensions.
          */}
       </div>
       <div className="flex-1 min-w-0 flex flex-col justify-center overflow-hidden">
          <div className="relative overflow-hidden">
            <motion.div
              key={`marquee-title-${currentVideo.slug}`}
              initial={{ x: 0 }}
              animate={{ 
                x: status === 'playing' ? [0, -400] : 0 
              }}
              transition={{ 
                duration: 15, 
                repeat: Infinity, 
                ease: "linear",
                repeatDelay: 1
              }}
              className="whitespace-nowrap inline-block"
            >
              <span className="text-sm font-bold text-slate-900 dark:text-white pr-10">
                {currentVideo.title}
              </span>
              {status === 'playing' && (
                <span className="text-sm font-bold text-slate-900 dark:text-white pr-10">
                  {currentVideo.title}
                </span>
              )}
            </motion.div>
            {/* Fade edges */}
            <div className="absolute inset-y-0 left-0 w-4 bg-linear-to-r from-white dark:from-background-dark to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-4 bg-linear-to-l from-white dark:from-background-dark to-transparent z-10" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-primary/80 mt-0.5 ml-1 truncate">
            {currentVideo.categoryName}
          </span>
       </div>
       <div className="flex items-center gap-1">
          <button 
            onClick={handlePlayPause} 
            className="w-12 h-12 flex items-center justify-center text-slate-900 dark:text-white active:scale-95 transition-all"
          >
             <span className="material-symbols-outlined text-3xl filled-icon">
                {status === 'playing' ? 'pause' : 'play_arrow'}
             </span>
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); close(); }} 
            className="w-10 h-10 flex items-center justify-center text-slate-400 dark:text-white/40 active:scale-90 transition-transform"
          >
             <span className="material-symbols-outlined text-2xl">close</span>
          </button>
       </div>
    </div>
  );
};

export default VerticalMiniPlayerView;
