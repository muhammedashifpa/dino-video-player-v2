import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence, type PanInfo, useMotionValue, useTransform } from 'motion/react';
import { usePlayerStore } from '../../store/usePlayerStore';
import VerticalFullPlayerView from './VerticalFullPlayerView';
import VerticalMiniPlayerView from './VerticalMiniPlayerView';
import VerticalVideoDrawer from './VerticalVideoDrawer';

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
    setError
  } = usePlayerStore();
  
  const [showControls, setShowControls] = useState(true);
  const [showDrawer, setShowDrawer] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [lastInteractionTime, setLastInteractionTime] = useState(Date.now());
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const seekerRef = useRef<HTMLDivElement>(null);
  
  
  
  // Drag and animation values
  const y = useMotionValue(0);
  const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
  
  // Transform values for mini-player transition
  const opacity = useTransform(y, [0, screenHeight * 0.4], [1, 0.5]);
  const scale = useTransform(y, [0, screenHeight * 0.4], [1, 0.9]);
  const dragY = useTransform(y, [0, 800], [0, 800]);

  // Helper to reset auto-hide timer
  const resetAutoHideTimer = () => {
    setShowControls(true);
    setLastInteractionTime(Date.now());
  };

  // Auto-hide controls
  useEffect(() => {
    if (showControls && viewMode === 'full' && status === 'playing' && !error) {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 2000);
    }
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [showControls, viewMode, status, error, lastInteractionTime]);

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

  // Sync video playback
  useEffect(() => {
    if (videoRef.current) {
      if (status === 'playing') {
        videoRef.current.play().catch(() => pause());
      } else {
        videoRef.current.pause();
      }
    }
  }, [status, currentVideo, pause]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setProgress(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handlePlayPause = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    resetAutoHideTimer();
    if (status === 'playing') {
      pause();
    } else if (currentVideo) {
      play(currentVideo);
    }
  };

  const handleSkipForward = (e: React.MouseEvent) => {
    e.stopPropagation();
    resetAutoHideTimer();
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(videoRef.current.currentTime + 10, duration);
    }
  };

  const handleSkipBackward = (e: React.MouseEvent) => {
    e.stopPropagation();
    resetAutoHideTimer();
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
    }
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (viewMode === 'full' && info.offset.y > 150) {
      minimize();
    }
    y.set(0);
  };

  const handleVideoError = () => {
    setError("Failed to load video. Please check your connection or try again.");
  };

  const handleRetry = (e: React.MouseEvent) => {
    e.stopPropagation();
    setError(null);
    if (videoRef.current) {
      videoRef.current.load();
      play(currentVideo!);
    }
  };

  const handleSeek = (e: React.PointerEvent | React.MouseEvent | PointerEvent) => {
    const rect = seekerRef.current?.getBoundingClientRect();
    if (rect && videoRef.current) {
      const x = e.clientX - rect.left;
      const pct = Math.max(0, Math.min(1, x / rect.width));
      const newTime = pct * duration;
      videoRef.current.currentTime = newTime;
      setProgress(newTime);
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    setIsSeeking(true);
    handleSeek(e);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isSeeking) {
      handleSeek(e);
    }
  };

  const handlePointerUp = () => {
    setIsSeeking(false);
  };

  // Global pointer tracking for smoother seeking
  useEffect(() => {
    if (isSeeking) {
      const handleGlobalPointerMove = (e: PointerEvent) => {
        handleSeek(e);
      };
      const handleGlobalPointerUp = () => {
        handlePointerUp();
      };

      window.addEventListener('pointermove', handleGlobalPointerMove);
      window.addEventListener('pointerup', handleGlobalPointerUp);

      return () => {
        window.removeEventListener('pointermove', handleGlobalPointerMove);
        window.removeEventListener('pointerup', handleGlobalPointerUp);
      };
    }
  }, [isSeeking]);

  const overlayVariants = {
    hidden: { 
      top: originRect?.top ?? screenHeight,
      left: originRect?.left ?? 0,
      width: originRect?.width ?? '100%',
      height: originRect?.height ?? '100%',
      opacity: 0,
      borderRadius: 12,
    },
    full: { 
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      opacity: 1,
      borderRadius: 0,
    },
    mini: {
      top: screenHeight - 92 - 80, // screenHeight - height - bottom_offset
      left: 8,
      width: 'calc(100% - 16px)',
      height: 92,
      opacity: 1,
      borderRadius: 8,
    }
  };

  const videoContainerVariants = {
    hidden: {
      width: originRect?.width ?? '100%',
      height: originRect?.height ?? '100%',
      x: 0,
      y: 0,
      borderRadius: 12,
    },
    full: {
      width: '100%',
      height: '100%',
      x: 0,
      y: 0,
      borderRadius: 0,
    },
    mini: {
      width: 112, // w-28
      height: 92,
      x: 0,
      y: 0,
      borderRadius: 0,
    }
  };

  if (viewMode === 'hidden' || !currentVideo) return null;

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
        className={`fixed z-50 overflow-hidden shadow-2xl flex flex-col items-center ${
          viewMode === 'mini' ? 'bg-transparent' : 'bg-black'
        }`}
      >
        {/* Shared Video Container */}
        <motion.div
          variants={videoContainerVariants}
          initial="hidden"
          animate={viewMode}
          className={`absolute left-0 top-0 overflow-hidden bg-black transition-all ${
            viewMode === 'mini' ? 'z-30 pointer-events-none' : 'z-0'
          }`}
        >
          <video
            ref={videoRef}
            src={currentVideo.mediaUrl}
            poster={currentVideo.thumbnailUrl}
            className="w-full h-full object-cover"
            playsInline
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => { pause(); setShowControls(true); }}
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
          <div className="absolute inset-0 w-full h-full flex flex-col max-w-[430px] mx-auto overflow-hidden">
            {/* Layer 1: Player UI (Metadata & Controls) */}
            <motion.div 
              className="absolute inset-0 w-full h-full z-20 flex flex-col"
              style={{ y: dragY, opacity, scale }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 800 }}
              dragElastic={0.1}
              onDragEnd={handleDragEnd}
              onClick={() => !showControls && resetAutoHideTimer()}
            >
              <VerticalFullPlayerView 
                showControls={showControls}
                status={status}
                progress={progress}
                duration={duration}
                error={error}
                isSeeking={isSeeking}
                handlePlayPause={handlePlayPause}
                handleSkipForward={handleSkipForward}
                handleSkipBackward={handleSkipBackward}
                handleRetry={handleRetry}
                handlePointerDown={handlePointerDown}
                handlePointerMove={handlePointerMove}
                handlePointerUp={handlePointerUp}
                seekerRef={seekerRef}
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
        )}

        {/* Mini Player View */}
        {viewMode === 'mini' && (
          <VerticalMiniPlayerView 
            handlePlayPause={handlePlayPause}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default VerticalVideoPlayerOverlay;
