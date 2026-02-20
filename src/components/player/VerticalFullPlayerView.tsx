import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePlayerStore } from '../../store/usePlayerStore';
import CategoryTag from '../feed/CategoryTag';
import PlayerButton from '../ui/PlayerButton';
import { formatTime } from '../../utils/timeUtils';

interface VerticalFullPlayerViewProps {
  showControls: boolean;
  status: string;
  progress: number;
  duration: number;
  error: string | null;
  isSeeking: boolean;
  handlePlayPause: (e?: React.MouseEvent) => void;
  handleSkipForward: (e: React.MouseEvent) => void;
  handleSkipBackward: (e: React.MouseEvent) => void;
  handleRetry: (e: React.MouseEvent) => void;
  onSeek: (time: number) => void;
  onSeekStart: () => void;
  onSeekEnd: () => void;
  showDrawer: boolean;
  setShowDrawer: (show: boolean) => void;
}

const VerticalFullPlayerView: React.FC<VerticalFullPlayerViewProps> = ({
  showControls,
  status,
  progress,
  duration,
  error,
  isSeeking,
  handlePlayPause,
  handleSkipForward,
  handleSkipBackward,
  handleRetry,
  onSeek,
  onSeekStart,
  onSeekEnd,
  showDrawer,
  setShowDrawer
}) => {
  const { currentVideo, minimize } = usePlayerStore();

  if (!currentVideo) return null;

  return (
    <>
      {/* Background Layer (Visuals only) */}
      <div className="absolute inset-0 z-0 pointer-events-none" />

      {/* Error Overlay */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center"
          >
            <span className="material-symbols-outlined text-white/40 text-6xl mb-6">error</span>
            <h3 className="text-white text-lg font-bold mb-2">Playback Error</h3>
            <p className="text-white/60 text-sm mb-8 max-w-xs">{error}</p>
            <button 
              onClick={handleRetry}
              className="px-8 py-3 rounded-full bg-white text-black font-bold text-sm active:scale-95 transition-transform flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">replay</span>
              Try Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <AnimatePresence mode="wait">
        {showControls && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 left-0 w-full z-30 pt-6 px-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-white text-xl font-bold leading-tight drop-shadow-lg">
                  {currentVideo.title}
                </h2>
                <CategoryTag 
                  label={currentVideo.categoryName || 'Artificial Intelligence'} 
                  className="mt-2 bg-primary/30 backdrop-blur-sm border border-primary/20"
                />
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); minimize(); }}
                className="mt-1 text-white/80 active:scale-90 transition-transform"
              >
                <span className="material-symbols-outlined text-2xl">expand_more</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Center Controls */}
      <AnimatePresence mode="wait">
        {showControls && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex items-center justify-center gap-10 pointer-events-none"
          >
            <PlayerButton 
              icon="replay_10" 
              onClick={handleSkipBackward}
            />

            <PlayerButton 
              variant="large"
              icon={status === 'playing' ? 'pause' : 'play_arrow'}
              onClick={handlePlayPause}
              isActive
            />

            <PlayerButton 
              icon="forward_10" 
              onClick={handleSkipForward}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Interaction Layer (Unifies Seeker & Upcoming Swipe) */}
      <AnimatePresence mode="wait">
        {showControls && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-0 left-0 w-full z-20 pb-8 pt-4 flex flex-col items-center pointer-events-auto"
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.1}
            onDragEnd={(_, info) => {
              if (info.offset.y < -50) {
                setShowDrawer(true);
              }
            }}
          >
            {/* Progress Bar Container */}
            <div className="w-full px-6 mb-4">
              <div className="relative w-full h-6 flex items-center group">
                {/* Track Background */}
                <div className="w-full bg-white/10 rounded-full h-1 overflow-hidden">
                  <motion.div 
                    className="h-full bg-primary shadow-[0_0_12px_rgba(173,43,238,0.8)]"
                    style={{ width: `${(progress / (duration || 1)) * 100}%` }}
                  />
                </div>
                
                {/* Native Range Input (Transparent) */}
                <input
                  type="range"
                  min={0}
                  max={duration || 1}
                  step="any"
                  value={progress}
                  onChange={(e) => onSeek(Number(e.target.value))}
                  onPointerDown={onSeekStart}
                  onPointerUp={onSeekEnd}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30"
                />

                {/* Visual Thumb (Matches previous design) */}
                <motion.div 
                  className="absolute w-5 h-5 bg-white rounded-full shadow-2xl border-2 border-primary z-20 pointer-events-none"
                  style={{ 
                    left: `${(progress / (duration || 1)) * 100}%`, 
                    x: '-50%' 
                  }}
                  animate={{ 
                    scale: isSeeking ? 1.2 : 1,
                    opacity: 1
                  }}
                  whileHover={{ scale: 1.2 }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-black text-white/60 mt-1 uppercase tracking-widest">
                <span className={isSeeking ? 'text-primary' : ''}>{formatTime(progress)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Upcoming Prompt */}
            {!showDrawer && (
              <div className="flex flex-col items-center gap-1 pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-white text-2xl drop-shadow-md animate-bounce">expand_less</span>
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/90 drop-shadow-lg">Upcoming</span>
              </div>
            )}
            
            <div className="pb-4" />
          </motion.div>
        )}
      </AnimatePresence>

    </>
  );
};

export default VerticalFullPlayerView;
