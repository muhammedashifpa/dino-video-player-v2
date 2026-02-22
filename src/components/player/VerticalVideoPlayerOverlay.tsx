import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence, type PanInfo, useMotionValue, useTransform } from 'motion/react';
import { usePlayerStore } from '../../store/usePlayerStore';
import VerticalFullPlayerView from './VerticalFullPlayerView';
import VerticalMiniPlayerView from './VerticalMiniPlayerView';
import VerticalVideoDrawer from './VerticalVideoDrawer';
import AutoPlayOverlay from './AutoPlayOverlay';
import CloseButton from '../ui/CloseButton';
import { useVideoFeed } from '../../hooks/useVideoFeed';
import { optimizeThumbnail } from '../../utils/imageUtils';
import { useAutoHideControls } from '../../hooks/useAutoHideControls';
import { usePictureInPicture } from '../../hooks/usePictureInPicture';
import { useVideoPlayback } from '../../hooks/useVideoPlayback';
import { getOverlayVariants, getVideoContainerVariants } from './playerVariants';

/**
 * The primary video player overlay component.
 * It manages the transition between full-screen and mini-player modes,
 * handles gesture-based minimization, auto-play logic, and integrates
 * video controls with metadata display.
 * 
 * It uses several custom hooks to separate concerns:
 * - `useVideoPlayback`: Core playback logic and video element interactions.
 * - `useAutoHideControls`: Auto-hiding UI based on user activity.
 * - `usePictureInPicture`: Browser PiP API integration.
 * - `usePlayerStore`: Global player state (current video, view mode, etc.).
 */
const VerticalVideoPlayerOverlay: React.FC = () => {
  const { 
    viewMode, 
    currentVideo, 
    status, 
    minimize, 
    play, 
    pause,
    progress,
    duration,
    setProgress,
    setDuration,
    maximize,
    originRect,
    error,
    setError,
    close
  } = usePlayerStore();
  
  const [showDrawer, setShowDrawer] = useState(false);
  const [nextVideoToAutoPlay, setNextVideoToAutoPlay] = useState<any>(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const { filteredVideos } = useVideoFeed(true);
  
  const { showControls, setShowControls, resetAutoHideTimer } = useAutoHideControls({
    viewMode,
    status,
    error
  });

  const { isPiPActive, togglePiP, exitPiP } = usePictureInPicture(videoRef);

  const {
    isSeeking,
    handleTimeUpdate,
    handleLoadedMetadata,
    handlePlayPause,
    handleSkipForward,
    handleSkipBackward,
    handleSeekChange,
    handleSeekStart,
    handleSeekEnd,
    handleRetry
  } = useVideoPlayback({
    videoRef,
    currentVideo,
    status,
    duration,
    play,
    pause,
    setProgress,
    setDuration,
    setError,
    onInteraction: resetAutoHideTimer
  });

  // Drag and animation values
  const y = useMotionValue(0);
  const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
  
  // Transform values for mini-player transition
  const opacity = useTransform(y, [0, screenHeight * 0.4], [1, 0.5]);
  const scale = useTransform(y, [0, screenHeight * 0.4], [1, 0.9]);
  const dragY = useTransform(y, [0, 800], [0, 800]);

  // Reset y position when maximizing to full screen
  useEffect(() => {
    if (viewMode === 'full') {
      y.set(0);
    }
  }, [viewMode, y]);

  // Show controls on video change or expansion
  useEffect(() => {
    if (currentVideo?.slug || viewMode === 'full') {
      resetAutoHideTimer();
    }
  }, [currentVideo?.slug, viewMode]);

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

  // Window resize listener
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (viewMode === 'full' && info.offset.y > 150) {
      minimize();
    }
    y.set(0);
  };

  const handleVideoError = () => {
    const mediaError = videoRef.current?.error;
    let message = "An unknown error occurred during playback.";

    if (mediaError) {
      switch (mediaError.code) {
        case MediaError.MEDIA_ERR_ABORTED:
          message = "Playback was aborted by the user.";
          break;
        case MediaError.MEDIA_ERR_NETWORK:
          message = "Network error: Connection to the video server failed.";
          break;
        case MediaError.MEDIA_ERR_DECODE:
          message = "Decoding error: Your device cannot play this video format.";
          break;
        case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
          message = "Source error: The video could not be loaded or the format is not supported.";
          break;
      }
    }
    
    setError(message);
  };

  const handleClose = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await exitPiP();
    close();
  };

  const handleVideoEnded = () => {
    pause(); 
    setShowControls(true);
    
    if (filteredVideos.length > 1 && currentVideo) {
      const currentIndex = filteredVideos.findIndex(v => v.slug === currentVideo.slug);
      const nextIndex = (currentIndex + 1) % filteredVideos.length;
      const nextVid = filteredVideos[nextIndex];
      
      setNextVideoToAutoPlay({
        slug: nextVid.slug,
        title: nextVid.title,
        thumbnailUrl: nextVid.thumbnailUrl,
        mediaUrl: nextVid.mediaUrl,
        channelName: nextVid.channelName,
        channelAvatarUrl: nextVid.channelAvatarUrl,
        categorySlug: nextVid.categorySlug,
        categoryName: nextVid.categoryName
      });
    }
  };

  const handleAutoPlayCancel = () => {
    setNextVideoToAutoPlay(null);
  };

  const handleAutoPlayComplete = () => {
    if (nextVideoToAutoPlay) {
      play(nextVideoToAutoPlay);
      setNextVideoToAutoPlay(null);
    }
  };

  if (viewMode === 'hidden' || !currentVideo) return null;

  const overlayVariants = getOverlayVariants(screenHeight, originRect);
  const videoContainerVariants = getVideoContainerVariants(windowWidth, originRect);

  return (
    <AnimatePresence>
      <motion.div
        key="vertical-video-overlay"
        layout
        variants={overlayVariants}
        initial="hidden"
        animate={viewMode}
        exit="hidden"
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        onClick={() => viewMode === 'mini' && maximize()}
        onMouseMove={resetAutoHideTimer}
        className={`fixed z-50 overflow-hidden shadow-2xl flex flex-col items-center ${
          viewMode === 'mini' ? 'bg-transparent cursor-pointer' : 'bg-black'
        }`}
      >
        {/* Shared Video Container */}
        <motion.div
          variants={videoContainerVariants}
          initial="hidden"
          animate={viewMode}
          className={`absolute top-0 overflow-hidden bg-black transition-all ${
            viewMode === 'mini' ? 'z-30 pointer-events-none' : 'z-0'
          }`}
        >
          <video
            ref={videoRef}
            src={currentVideo.mediaUrl}
            poster={optimizeThumbnail(currentVideo.thumbnailUrl, 400)}
            className="w-full h-full object-cover"
            playsInline
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleVideoEnded}
            onError={handleVideoError}
          />
          {/* Gradient Overlay for Full Screen */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: (viewMode === 'full' && showControls) ? 1 : 0 }}
            className="absolute inset-0 bg-linear-to-t from-black via-transparent to-black/60 pointer-events-none z-10"
          />
        </motion.div>

        {/* Full Screen View Layers */}
        {viewMode === 'full' && (
          <>
            {/* Desktop Only Outside Close Button */}
            <CloseButton 
              onClick={handleClose}
              className="hidden md:flex fixed top-6 right-6 w-12 h-12 z-60"
              title="Close Player"
            />

            <div className="absolute inset-0 w-full h-full flex flex-col max-w-[430px] mx-auto overflow-hidden">
              {/* Layer 1: Player UI (Metadata & Controls) */}
            <motion.div 
              className="absolute inset-0 w-full h-full z-20 flex flex-col"
              style={{ y: dragY, opacity, scale }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 800 }}
              dragElastic={0.1}
              onDragEnd={handleDragEnd}
              onClick={() => {
                if (!showControls) {
                  resetAutoHideTimer();
                } else if (status === 'playing') {
                  setShowControls(false);
                }
              }}
            >
              <VerticalFullPlayerView 
                showControls={showControls}
                status={status}
                progress={progress}
                duration={duration}
                error={error}
                isSeeking={isSeeking}
                isPiPActive={isPiPActive}
                handlePlayPause={handlePlayPause}
                handleSkipForward={handleSkipForward}
                handleSkipBackward={handleSkipBackward}
                handleTogglePiP={togglePiP}
                handleRetry={handleRetry}
                onSeek={handleSeekChange}
                onSeekStart={handleSeekStart}
                onSeekEnd={handleSeekEnd}
                showDrawer={showDrawer}
                setShowDrawer={setShowDrawer}
              />
            </motion.div>

            {/* Layer 2: Drawer System (Swipe Zone & Drawer Sheet) */}
            <div className="absolute inset-0 w-full h-full z-40 pointer-events-none">
              <VerticalVideoDrawer 
                showDrawer={showDrawer}
                setShowDrawer={setShowDrawer}
              />
              </div>
            </div>
          </>
        )}

        {/* Mini Player View */}
        {viewMode === 'mini' && (
          <VerticalMiniPlayerView 
            handlePlayPause={handlePlayPause}
            handleClose={handleClose}
          />
        )}

        <AnimatePresence>
          {nextVideoToAutoPlay && (
            <AutoPlayOverlay
              key={nextVideoToAutoPlay.slug}
              nextVideo={nextVideoToAutoPlay}
              onCancel={handleAutoPlayCancel}
              onPlayNow={handleAutoPlayComplete}
              onComplete={handleAutoPlayComplete}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

export default VerticalVideoPlayerOverlay;
