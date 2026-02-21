import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePlayerStore } from '../../store/usePlayerStore';
import { useVideoFeed } from '../../hooks/useVideoFeed';
import CategoryPills from '../feed/CategoryPills';
import CloseButton from '../ui/CloseButton';
import LazyThumbnail from '../LazyThumbnail';

interface VerticalVideoDrawerProps {
  showDrawer: boolean;
  setShowDrawer: (show: boolean) => void;
}

const VerticalVideoDrawer: React.FC<VerticalVideoDrawerProps> = ({
  showDrawer,
  setShowDrawer,
}) => {
  const { play, currentVideo } = usePlayerStore();
  const { filteredVideos, categories, selectedCategory, setSelectedCategory } = useVideoFeed(true);

  return (
    <AnimatePresence>
      {showDrawer && (
        <>
          {/* Backdrop for click outside to close */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDrawer(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-md pointer-events-auto cursor-pointer z-40"
          />

          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 800 }}
            dragElastic={0.1}
            dragPropagation={false}
            onDragEnd={(_, info) => {
              if (info.offset.y > 150) {
                setShowDrawer(false);
              }
            }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute bottom-0 left-0 w-full h-[65%] bg-background-light/95 dark:bg-surface-dark/95 backdrop-blur-xl pointer-events-auto rounded-t-[32px] border-t border-black/5 dark:border-white/10 flex flex-col touch-none z-50 shadow-2xl"
          >
            {/* Universal Outside Centered Close Button */}
            <CloseButton 
              onClick={() => setShowDrawer(false)}
              className="flex absolute -top-20 left-1/2 -translate-x-1/2 w-12 h-12 z-50"
              title="Close Drawer"
            />

            <div
              className="w-12 h-1.5 bg-black/10 dark:bg-white/20 rounded-full mx-auto mt-4 mb-6 cursor-pointer"
              onClick={() => setShowDrawer(false)}
            />

            {/* Category Filter */}
            <div className="px-4 mb-6">
              <CategoryPills 
                categories={categories}
                selectedCategory={selectedCategory}
                onSelect={setSelectedCategory}
                hidePadding
                containerClassName="bg-transparent"
              />
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-4 space-y-2 pb-20 scrollbar-none">
              {filteredVideos.map((video, idx) => {
                const isActive = currentVideo?.slug === video.slug;
                
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      if (isActive) return;
                      play({
                        slug: video.slug,
                        title: video.title,
                        thumbnailUrl: video.thumbnailUrl,
                        mediaUrl: video.mediaUrl,
                        channelName: video.channelName,
                        channelAvatarUrl: video.channelAvatarUrl,
                        categorySlug: video.categorySlug,
                        categoryName: video.categoryName
                      });
                      setShowDrawer(false);
                    }}
                    className={`flex gap-4 items-center py-1 px-2 rounded-2xl transition-all duration-300 ${
                      isActive 
                        ? 'bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 shadow-sm scale-[1.02]' 
                        : 'hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer hover:opacity-100'
                    }`}
                  >
                    <div className={`w-32 h-20 rounded-lg overflow-hidden bg-black/40 border shrink-0 relative ${
                      isActive ? 'border-primary/50' : 'border-white/5'
                    }`}>
                      <LazyThumbnail src={video.thumbnailUrl} alt={video.title} width={200} />
                      {isActive && (
                        <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                          <div className="flex gap-1 items-end h-5">
                            {[1, 2, 3].map((i) => (
                              <motion.div
                                key={i}
                                animate={{ height: [6, 20, 10, 20, 6] }}
                                transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.2 }}
                                className="w-1 bg-primary shadow-[0_0_8px_rgba(173,43,238,0.5)]"
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 overflow-hidden">
                      {isActive ? (
                        <div className="relative overflow-hidden w-full h-5">
                          <motion.h4 
                            animate={{ x: [0, -100] }}
                            transition={{ 
                              x: {
                                repeat: Infinity,
                                duration: 8,
                                ease: "linear",
                                repeatType: "loop"
                              }
                            }}
                            className="text-sm font-bold text-primary whitespace-nowrap absolute"
                          >
                            {video.title} &nbsp;&nbsp;&nbsp;&nbsp; {video.title} &nbsp;&nbsp;&nbsp;&nbsp; {video.title}
                          </motion.h4>
                        </div>
                      ) : (
                        <h4 className="text-sm font-medium text-slate-800 dark:text-white truncate">{video.title}</h4>
                      )}
                      <p className={`text-[10px] uppercase font-black tracking-[0.2em] mt-1 ${
                        isActive ? 'text-primary/60' : 'text-slate-400 dark:text-white/30'
                      }`}>
                        {video.categoryName || video.categorySlug || 'Tech'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default VerticalVideoDrawer;
