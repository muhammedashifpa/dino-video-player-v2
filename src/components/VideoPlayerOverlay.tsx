import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence, type PanInfo } from 'motion/react';
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
    setDuration,
    maximize
  } = usePlayerStore();
  
  const [showControls, setShowControls] = React.useState(true);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const { categories, selectedCategory, setSelectedCategory, filteredVideos, isLoading } = useVideoFeed(true);

  // Lock body scroll when in full screen
  useEffect(() => {
    if (viewMode === 'full') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [viewMode]);

  React.useEffect(() => {
    if (currentVideo && categories.includes(currentVideo.channelName)) {
      setSelectedCategory(currentVideo.channelName);
    }
  }, [currentVideo, categories, setSelectedCategory]);

  // Sync video playback with store status
  useEffect(() => {
    if (videoRef.current) {
      if (status === 'playing') {
        videoRef.current.play().catch(() => {
          // Handle autoplay failure or interruption
          pause();
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [status, currentVideo]);

  // Handle video ended
  const handleVideoEnded = () => {
    pause();
  };

  // Handle time update
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setProgress(videoRef.current.currentTime);
    }
  };

  // Handle loaded metadata
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  // Auto-hide controls logic
  const handleUserActivity = () => {
    setShowControls(true);
    
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }

    if (status === 'playing') {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  useEffect(() => {
    if (status === 'paused') {
      setShowControls(true);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    } else {
      handleUserActivity();
    }
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [status]);

  const isPlaying = status === 'playing';

  const handleSeek = (newTime: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
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
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(videoRef.current.currentTime + 10, duration);
      setProgress(videoRef.current.currentTime);
    }
  };

  const handleSkipBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
      setProgress(videoRef.current.currentTime);
    }
  };

  // Filter related videos (exclude current video from the already filtered list)
  const relatedVideos = filteredVideos
    .filter(v => v.title !== currentVideo?.title)
    .slice(0, 20);

  const handleRelatedClick = (video: VideoCardProps) => {
    play({
        slug: video.slug || video.title,
        title: video.title,
        thumbnailUrl: video.thumbnailUrl,
        mediaUrl: video.mediaUrl || '',
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
      bottom: 24, 
      height: 80,
      width: 'calc(100% - 24px)',
      borderRadius: 12,
      pointerEvents: 'auto' as const
    }
  };

  return (
    <AnimatePresence>
      {(viewMode !== 'hidden' && currentVideo) && (
        <motion.div 
          key="video-overlay"
          layout
          variants={overlayVariants}
          initial="hidden"
          animate={viewMode as string}
          exit="hidden"
          transition={{ type: 'spring', damping: 25, stiffness: 200,  }}
          drag={viewMode === 'full' ? 'y' : undefined}
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ bottom: 0.5 }}
          onDragEnd={handleDragEnd}
          whileTap={{ scale: viewMode === 'mini' ? 0.9 : 1, }}
          // whileDrag={{scaleY:0.9, scaleX:0.9 , borderRadius:15}}
          whileHover={{ scale: viewMode === 'mini' ? 1.02 : 1 }}
          onClick={() => viewMode === 'mini' && maximize()}
          onMouseMove={handleUserActivity}
          onTouchStart={handleUserActivity}
          className={`z-50 flex overflow-hidden bg-white dark:bg-background-dark text-slate-900 dark:text-white shadow-2xl ${
            viewMode === 'full' ? 'fixed inset-0' : 'fixed'
          }`}
          style={{ 
            flexDirection: viewMode === 'mini' ? 'row' : 'column',
            left: viewMode === 'full' ? 0 : '',
            right: viewMode === 'full' ? 0 : ''
          }}
        >
          

          {/* Video Player Section */}
          <motion.div 
            layout
            className={`relative shrink-0 overflow-hidden bg-black z-10 ${
            viewMode === 'full' ? 'w-full aspect-video' : 'h-full w-[120px]'
          }`}>
            
            {/* Main Video Player */}
            <video
              ref={videoRef}
              src={currentVideo.mediaUrl}
              poster={currentVideo.thumbnailUrl}
              className="absolute inset-0 h-full w-full object-cover"
              playsInline
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={handleVideoEnded}
              onClick={handlePlayPause}
            />

            {/* Video Player Controls (Full Mode) */}
            {viewMode === 'full' && (
              <VideoPlayerControls 
                isVisible={showControls}
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
          </motion.div>

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
      )}
    </AnimatePresence>
  );
};

export default VideoPlayerOverlay;
