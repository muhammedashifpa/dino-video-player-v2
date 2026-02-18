import React from 'react';
import { motion, type PanInfo } from 'motion/react';
import { usePlayerStore } from '../store/usePlayerStore';
import VideoPlayerControls from './VideoPlayerControls';
import { useVideoFeed } from '../hooks/useVideoFeed';
import type { VideoCardProps } from './VideoCard';
import MiniPlayerView from './overlay/MiniPlayerView';
import OverlayMetadata from './overlay/OverlayMetadata';
import RelatedVideosList from './overlay/RelatedVideosList';
import { getStableLikes } from '../utils/numberUtils';

const VideoPlayerOverlay: React.FC = () => {
  const { 
    viewMode, 
    currentVideo, 
    status, 
    minimize, 
    close,
    play, 
    pause,
    progress,
    duration,
    setProgress,
    setDuration
  } = usePlayerStore();

  const { categories, selectedCategory, setSelectedCategory, filteredVideos, isLoading } = useVideoFeed(true);

  React.useEffect(() => {
    if (currentVideo && categories.includes(currentVideo.channelName)) {
      setSelectedCategory(currentVideo.channelName);
    }
  }, [currentVideo, categories, setSelectedCategory]);

  // Simulate playback
  React.useEffect(() => {
    if (status === 'playing') {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= duration) {
            pause();
            return duration;
          }
          return prev + 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [status, duration, pause, setProgress]);

  // Set initial duration when video loads
  React.useEffect(() => {
    if (currentVideo) {
      setDuration(600); // Mock duration 10:00
      setProgress(0);
    }
  }, [currentVideo, setDuration, setProgress]);

  if (viewMode === 'hidden' || !currentVideo) return null;

  const isPlaying = status === 'playing';

  const handleSeek = (newTime: number) => {
    setProgress(newTime);
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      if (currentVideo) play(currentVideo);
    }
  };

  const handleSkipForward = () => {
    setProgress((prev) => Math.min(prev + 10, duration));
  };

  const handleSkipBackward = () => {
    setProgress((prev) => Math.max(0, prev - 10));
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


  // Generate stable likes
  const likeCount = currentVideo ? getStableLikes(currentVideo.title) : 0;

  // Drag handling
  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (viewMode === 'full' && info.offset.y > 100) {
      minimize();
    }
  };

  const overlayVariants = {
    hidden: { 
      y: '100%', 
      opacity: 0,
      pointerEvents: 'none' as const
    },
    full: { 
      y: 0, 
      opacity: 1,
      // Use uniform positioning properties for smooth layout animation
      left: 0,
      right: 0,
      bottom: 0,
      height: '100%',
      // Explicitly set width to avoid layout thrashing
      width: '100%',
      borderRadius: 0,
      pointerEvents: 'auto' as const
    },
    mini: { 
      y: 0, 
      opacity: 1,
      left: 12,
      right: 12,
      bottom: 90, 
      height: 80,
      width: 'calc(100% - 24px)',
      borderRadius: 12,
      pointerEvents: 'auto' as const
    }
  };

  return (
    <motion.div 
      // layout
      variants={overlayVariants}
      initial="hidden"
      animate={viewMode as string}
      exit="hidden"
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      drag={viewMode === 'full' ? 'y' : undefined}
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ bottom: 0.2 }}
      onDragEnd={handleDragEnd}
      onClick={() => viewMode === 'mini' && usePlayerStore.getState().maximize()}
      className="absolute z-50 flex overflow-hidden bg-white dark:bg-background-dark text-slate-900 dark:text-white shadow-2xl "
      style={{ flexDirection: viewMode === 'mini' ? 'row' : 'column' }}
    >
      
      {/* Drag Handle (Full Screen Only) */}
      {viewMode === 'full' && (
        <div className="absolute top-0 left-0 right-0 z-50 flex justify-center pt-3 pb-4 bg-gradient-to-b from-black/50 to-transparent pointer-events-none">
          <div className="h-1.5 w-12 rounded-full bg-white/30 backdrop-blur-sm"></div>
        </div>
      )}

      {/* Video Player Section */}
      <div className={`relative shrink-0 overflow-hidden bg-black transition-all duration-300 ${
        viewMode === 'full' ? 'w-full aspect-video z-10' : 'h-full w-[120px] z-10'
      }`}>
        
        {/* Main Video Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-80" 
          style={{ backgroundImage: `url('${currentVideo.thumbnailUrl}')` }}
        ></div>

        {/* Video Player Controls (Full Mode) */}
        {viewMode === 'full' && (
          <VideoPlayerControls 
            isPlaying={isPlaying}
            progress={progress}
            duration={duration}
            onPlayPause={handlePlayPause}
            onSkipForward={handleSkipForward} 
            onSkipBackward={handleSkipBackward}
            onSeek={handleSeek}
            onMinimize={minimize}
            onClose={close}
          />
        )}
      </div>

      {/* Mini Player Info & Controls */}
      {viewMode === 'mini' && (
        <MiniPlayerView 
          currentVideo={currentVideo}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onClose={close}
        />
      )}

      {/* Metadata & Related Videos (Hidden in Mini Mode) */}
      {viewMode === 'full' && (
        <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-background-dark">
          <div className="flex-1 overflow-y-auto scrollbar-none pb-24">
            
            <OverlayMetadata 
              currentVideo={currentVideo} 
              likeCount={likeCount} 
            />

            <RelatedVideosList 
              currentVideo={currentVideo}
              relatedVideos={relatedVideos}
              categories={categories}
              selectedCategory={selectedCategory}
              isLoading={isLoading}
              onSelectCategory={setSelectedCategory}
              onVideoClick={handleRelatedClick}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default VideoPlayerOverlay;
