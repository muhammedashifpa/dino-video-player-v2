import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePlayerStore } from '../../store/usePlayerStore';
import { useVideoFeed } from '../../hooks/useVideoFeed';
import CategoryTag from '../CategoryTag';
import PlayerButton from '../ui/PlayerButton';
import { formatTime } from '../../utils/timeUtils';

interface VerticalFullPlayerViewProps {
  showControls: boolean;
  status: string;
  progress: number;
  duration: number;
  error: string | null;
  showDrawer: boolean;
  setShowDrawer: (show: boolean) => void;
  isSeeking: boolean;
  handlePlayPause: (e?: React.MouseEvent) => void;
  handleSkipForward: (e: React.MouseEvent) => void;
  handleSkipBackward: (e: React.MouseEvent) => void;
  handleRetry: (e: React.MouseEvent) => void;
  handlePointerDown: (e: React.PointerEvent) => void;
  handlePointerMove: (e: React.PointerEvent) => void;
  handlePointerUp: () => void;
}

const VerticalFullPlayerView: React.FC<VerticalFullPlayerViewProps> = ({
  showControls,
  status,
  progress,
  duration,
  error,
  showDrawer,
  setShowDrawer,
  isSeeking,
  handlePlayPause,
  handleSkipForward,
  handleSkipBackward,
  handleRetry,
  handlePointerDown,
  handlePointerMove,
  handlePointerUp
}) => {
  const { currentVideo, minimize, play } = usePlayerStore();
  const { filteredVideos } = useVideoFeed(true);

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
            className="absolute top-0 left-0 w-full z-30 pt-16 px-6"
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

      {/* Bottom Section */}
      <AnimatePresence mode="wait">
        {showControls && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-0 left-0 w-full z-20 pb-10"
          >
            {/* Progress Bar */}
            <div className="px-6 mb-2">
              <div 
                className="relative w-full h-4 flex items-center cursor-pointer group"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
              >
                <motion.div 
                  className="w-full bg-white/10 rounded-full overflow-hidden"
                  animate={{ height: isSeeking ? 6 : 4 }}
                >
                  <motion.div 
                    className="h-full bg-primary shadow-[0_0_12px_rgba(173,43,238,0.8)]"
                    style={{ width: `${(progress / (duration || 1)) * 100}%` }}
                  />
                </motion.div>
                <motion.div 
                  className="absolute w-4 h-4 bg-white rounded-full shadow-2xl border-2 border-primary z-20"
                  style={{ left: `${(progress / (duration || 1)) * 100}%`, transform: 'translateX(-50%)' }}
                  animate={{ 
                    scale: isSeeking ? 1.5 : 0,
                    opacity: isSeeking ? 1 : 0
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-black text-white/60 mt-2 uppercase tracking-widest">
                <span className={isSeeking ? 'text-primary' : ''}>{formatTime(progress)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Bottom Controls / Spacing */}
            <div className="pt-6 pb-20 flex flex-col items-center">
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Swipe Up Box for Drawer */}
      {!showDrawer && showControls && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40"
        >
          <motion.div
            drag="y"
            dragConstraints={{ top: -200, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.y < -50) {
                setShowDrawer(true);
              }
            }}
            onClick={(e) => { e.stopPropagation(); setShowDrawer(true); }}
            className="px-8 py-3 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 flex flex-col items-center gap-1 cursor-grab active:cursor-grabbing shadow-2xl group active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-white text-2xl group-hover:-translate-y-1 transition-transform">expand_less</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/90">Upcoming</span>
          </motion.div>
        </motion.div>
      )}

      {/* Upcoming Videos Drawer (Bottom Sheet) */}
      <AnimatePresence>
        {showDrawer && (
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute bottom-0 left-0 w-full h-[65%] bg-surface-dark/95 backdrop-blur-xl z-50 rounded-t-[32px] border-t border-white/10 flex flex-col"
          >
            <div 
              className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mt-4 mb-6 cursor-pointer"
              onClick={() => setShowDrawer(false)}
            />
            
            {/* Category Filter */}
            <div className="px-6 mb-6 overflow-x-auto scrollbar-none">
              <div className="flex gap-2 whitespace-nowrap">
                {['All', 'Tech', 'AI', 'Design'].map((cat) => (
                  <button 
                    key={cat}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-colors ${
                      cat === 'All' 
                        ? 'bg-primary text-white border-primary' 
                        : 'bg-white/5 text-white/60 border-white/10'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-6 space-y-4 pb-20 scrollbar-none">
              {filteredVideos.map((video, idx) => (
                <div 
                  key={idx}
                  onClick={() => {
                    play({
                      slug: video.slug || video.title,
                      title: video.title,
                      thumbnailUrl: video.thumbnailUrl,
                      mediaUrl: video.mediaUrl || '',
                      channelName: video.channelName,
                      channelAvatarUrl: video.channelAvatarUrl,
                      categorySlug: video.categorySlug || 'all',
                      categoryName: video.categoryName || 'Tech'
                    });
                    setShowDrawer(false);
                  }}
                  className="flex gap-4 items-center p-2 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <div className="w-24 h-16 rounded-xl overflow-hidden bg-black/40 border border-white/5 shrink-0">
                    <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-white truncate">{video.title}</h4>
                    <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest mt-1">
                      {video.categorySlug || 'Tech'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VerticalFullPlayerView;
