import React from 'react';
import { motion, AnimatePresence, useInView, useSpring, useMotionValue } from 'motion/react';
import { usePlayerStore, type Video } from '../store/usePlayerStore';
import VideoPlayerControls from './VideoPlayerControls';
import { useVideoFeed } from '../hooks/useVideoFeed';
import RelatedVideoCard from './RelatedVideoCard';
import type { VideoCardProps } from './VideoCard';
import CategoryPills from './CategoryPills';

// Helper to generate a stable random like count based on string hash
const getStableLikes = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  const positiveHash = Math.abs(hash);
  return (positiveHash % 90000) + 5000; // Random number between 5000 and 95000
};

const AnimatedCounter = ({ value }: { value: number }) => {
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { stiffness: 50, damping: 15 });
  const ref = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  React.useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Intl.NumberFormat('en-US', { 
          notation: "compact", 
          maximumFractionDigits: 1,
          minimumFractionDigits: 1 
        }).format(Math.floor(latest));
      }
    });
  }, [springValue]);

  return <span ref={ref} className="text-xs tabular-nums text-right min-w-[4ch]" />;
};

const VideoPlayerOverlay: React.FC = () => {
  const { 
    viewMode, 
    currentVideo, 
    status, 
    minimize, 
    close,
    play, 
    pause 
  } = usePlayerStore();

  const { categories, selectedCategory, setSelectedCategory, filteredVideos, isLoading } = useVideoFeed(true);

  // Sentinel for sticky detection
  const sentinelRef = React.useRef(null);
  const isSticky = !useInView(sentinelRef, { amount: 1 });

  React.useEffect(() => {
    if (currentVideo && categories.includes(currentVideo.channelName)) {
      setSelectedCategory(currentVideo.channelName);
    }
  }, [currentVideo, categories, setSelectedCategory]);

  if (viewMode === 'hidden' || !currentVideo) return null;

  const isPlaying = status === 'playing';

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      if (currentVideo) play(currentVideo);
    }
  };

  // Filter related videos (exclude current video from the already filtered list)
  const relatedVideos = filteredVideos
    .filter(v => v.title !== currentVideo.title)
    .slice(0, 20);

  const handleRelatedClick = (video: VideoCardProps) => {
    play({
        slug: video.slug || video.title,
        title: video.title,
        thumbnailUrl: video.thumbnailUrl,
        mediaUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        channelName: video.channelName,
        channelAvatarUrl: video.channelAvatarUrl,
        categorySlug: video.categorySlug || 'all' 
    });
  };

  // Mock progress and duration for now
  const progress = 262; // 04:22
  const duration = 600; // 10:00

  // Generate stable likes
  const likeCount = currentVideo ? getStableLikes(currentVideo.title) : 0;

  return (
    <div className={`absolute inset-0 z-50 flex flex-col bg-background-dark text-white transition-all duration-300 overflow-hidden ${viewMode === 'mini' ? 'top-auto left-auto right-4 bottom-24 w-80 h-48 rounded-lg shadow-2xl border border-white/10' : ''}`}>
      
      {/* Drag Handle (Full Screen Only) */}
      {viewMode === 'full' && (
        <div className="flex w-full justify-center pt-3 pb-1 shrink-0 z-50 absolute top-0 left-0 bg-gradient-to-b from-black/50 to-transparent pointer-events-none">
          <div className="h-1.5 w-12 rounded-full bg-white/20"></div>
        </div>
      )}

      {/* Video Player Section */}
      <div className={`relative w-full bg-black shrink-0 overflow-hidden group ${viewMode === 'full' ? 'aspect-video mt-0' : 'h-full'}`}>
        
        {/* Main Video Background (Mock) */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-80" 
          style={{ backgroundImage: `url('${currentVideo.thumbnailUrl}')` }}
        ></div>

        {/* Video Player Controls */}
        <VideoPlayerControls 
          isPlaying={isPlaying}
          progress={progress}
          duration={duration}
          onPlayPause={handlePlayPause}
          onSkipForward={() => {}} 
          onSkipBackward={() => {}}
          onMinimize={minimize}
          onClose={close}
        />
      </div>

      {/* Metadata & Related Videos (Hidden in Mini Mode) */}
      {viewMode === 'full' && (
        <div className="flex-1 overflow-y-auto bg-background-dark/50 scrollbar-none pb-24 min-h-0">
          {/* Metadata Section */}
          <div className="flex flex-col gap-4 py-4 shrink-0 border-b border-white/5 bg-background-dark">
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentVideo.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-1 px-4"
              >
                <h1 className="text-xl font-bold leading-tight tracking-tight text-white">
                  {currentVideo.title}
                </h1>
                <p className="text-xs text-slate-400">1.2M views • 2 hours ago</p>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div 
                key={currentVideo.categorySlug}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between gap-4 px-4 overflow-x-auto scrollbar-none"
              >
                <div className="flex items-center gap-2 shrink-0">
                  <div className="h-10 w-10 rounded-full bg-linear-to-tr from-primary to-purple-400 p-[2px]">
                     <div className="h-full w-full rounded-full bg-background-dark p-px">
                       <img 
                         alt={currentVideo.channelName} 
                         className="h-full w-full rounded-full object-cover" 
                         src={currentVideo.channelAvatarUrl}
                       />
                     </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-white">{currentVideo.channelName}</span>
                    <span className="text-[10px] text-slate-400">840K Subscribers</span>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-2  py-1">
                  <div className="flex shrink-0 items-center gap-3 rounded-full bg-white/5 px-4 py-2">
                    <button className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-lg">thumb_up</span>
                      <AnimatedCounter value={likeCount} />
                    </button>
                    <div className="h-4 w-px bg-white/10"></div>
                    <button className="flex items-center">
                       <span className="material-symbols-outlined text-lg">thumb_down</span>
                    </button>
                  </div>
                   <div className="flex shrink-0 items-center gap-2 rounded-full bg-white/5 px-4 py-2">
                  <span className="material-symbols-outlined text-lg">share</span>
                  <span className="text-xs">Share</span>
                </div>
                 <div className="flex shrink-0 items-center gap-2 rounded-full bg-white/5 px-4 py-2">
                  <span className="material-symbols-outlined text-lg">download</span>
                  <span className="text-xs">Download</span>
                </div>
                 <div className="flex shrink-0 items-center gap-2 rounded-full bg-white/5 px-4 py-2">
                  <span className="material-symbols-outlined text-lg">playlist_add</span>
                  <span className="text-xs">Save</span>
                </div>
              </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Related Videos Section */}
          <div className="relative">
             {/* Sentinel for sticky detection */}
             <div ref={sentinelRef} className="absolute -top-1 left-0 right-0 h-1 pointer-events-none" />
             
             <div className={`sticky top-0 z-30 transition-all duration-300 mb-2 ${
               isSticky
                 ? 'bg-background-dark/95 backdrop-blur-xl border-b border-white/5 shadow-lg' 
                 : 'bg-transparent'
             }`}>
               <CategoryPills 
                 categories={categories}
                 isLoading={isLoading}
                 selectedCategory={selectedCategory}
                 onSelect={setSelectedCategory}
               />
             </div>
             <AnimatePresence mode="wait">
               <motion.div
                 key={`${selectedCategory}-${currentVideo.title}`}
                 className="space-y-6 px-4"
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -20 }}
                 transition={{ duration: 0.2 }}
               >
                 {relatedVideos.map((video, idx) => (
                   <motion.div
                      key={`${video.title}-${idx}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                   >
                     <RelatedVideoCard 
                       video={{
                         ...video,
                         slug: video.slug || video.title,
                         mediaUrl: '', // Add missing required fields if any
                         categorySlug: video.categorySlug || 'all'
                       } as Video}
                       onClick={() => handleRelatedClick(video)}
                     />
                   </motion.div>
                 ))}
               </motion.div>
             </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayerOverlay;
