import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence, type PanInfo, useMotionValue, useTransform } from 'motion/react';
import { usePlayerStore } from '../store/usePlayerStore';
import { useVideoFeed } from '../hooks/useVideoFeed';
import CategoryTag from './CategoryTag';
import PlayerButton from './PlayerButton';

const VerticalVideoPlayerOverlay: React.FC = () => {
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
    maximize,
    originRect,
    error,
    setError
  } = usePlayerStore();
  
  const [showControls, setShowControls] = useState(true);
  const [showDrawer, setShowDrawer] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const { filteredVideos } = useVideoFeed(true);

  // Drag and animation values
  const y = useMotionValue(0);
  const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
  
  // Transform values for mini-player transition
  const opacity = useTransform(y, [0, screenHeight * 0.4], [1, 0.5]);
  const scale = useTransform(y, [0, screenHeight * 0.4], [1, 0.9]);

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
  }, [showControls, viewMode, status, error]);

  // Show controls on video change or expansion
  useEffect(() => {
    if (currentVideo?.slug || viewMode === 'full') {
      setShowControls(true);
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
    setShowControls(true);
    if (status === 'playing') {
      pause();
    } else if (currentVideo) {
      play(currentVideo);
    }
  };

  const handleSkipForward = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowControls(true);
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(videoRef.current.currentTime + 10, duration);
    }
  };

  const handleSkipBackward = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowControls(true);
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
    }
  };

  const toggleControls = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowControls(prev => !prev);
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (viewMode === 'full' && info.offset.y > 150) {
      minimize();
    } else if (viewMode === 'full' && info.offset.y < -150) {
      setShowDrawer(true);
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

  const handleSeek = (e: React.PointerEvent | React.MouseEvent) => {
    const rect = e.currentTarget.parentElement?.getBoundingClientRect();
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

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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
      borderRadius: 16,
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
        className="fixed z-50 overflow-hidden bg-black shadow-2xl flex flex-col items-center"
      >
        {/* Full Screen View */}
        {viewMode === 'full' && (
          <motion.div 
            className="relative w-full h-full flex flex-col max-w-[430px] mx-auto overflow-hidden"
            style={{ y, opacity, scale }}
            drag="y"
            dragConstraints={{ top: -100, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
          >
            {/* Background Video */}
            <div className="absolute inset-0 z-0">
              <video
                ref={videoRef}
                src={currentVideo.mediaUrl}
                poster={currentVideo.thumbnailUrl}
                className="w-full h-full object-cover"
                playsInline
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => pause()}
                onError={handleVideoError}
                onClick={toggleControls}
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-black/60 z-10 pointer-events-none" />
              
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
            </div>

            {/* Header */}
            <AnimatePresence>
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
            <AnimatePresence>
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
            <AnimatePresence>
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
                      className="relative w-full h-3 flex items-center cursor-pointer group"
                      onPointerDown={handlePointerDown}
                      onPointerMove={handlePointerMove}
                      onPointerUp={handlePointerUp}
                      onPointerLeave={handlePointerUp}
                    >
                      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-primary shadow-[0_0_8px_rgba(173,43,238,0.5)]"
                          style={{ width: `${(progress / duration) * 100}%` }}
                        />
                      </div>
                      <motion.div 
                        className="absolute w-3 h-3 bg-white rounded-full shadow-lg border border-primary opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ left: `${(progress / duration) * 100}%`, transform: 'translateX(-50%)' }}
                        animate={{ scale: isSeeking ? 1.5 : 1 }}
                      />
                    </div>
                    <div className="flex justify-between text-[9px] font-bold text-white/40 mt-1.5 uppercase tracking-tighter">
                      <span>{formatTime(progress)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  {/* Drawer Handle */}
                  <div className="pt-6 pb-4 flex flex-col items-center">
                    <div 
                      className="flex flex-col items-center animate-pulse cursor-pointer"
                      onClick={() => setShowDrawer(true)}
                    >
                      <span className="material-symbols-outlined text-white text-2xl">expand_less</span>
                      <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/90">Upcoming Videos</span>
                    </div>
                    <div className="w-32 h-1 bg-white/20 rounded-full mt-4"></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

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
          </motion.div>
        )}

        {/* Mini Player View */}
        {viewMode === 'mini' && (
          <div className="w-full h-full flex items-center pr-4 gap-3 bg-surface-dark/95 backdrop-blur-xl border border-white/5">
             <div className="w-28 h-full shrink-0 bg-black/40 overflow-hidden">
                <img src={currentVideo.thumbnailUrl} alt="" className="w-full h-full object-cover" />
             </div>
             <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{currentVideo.title}</p>
             </div>
             <div className="flex items-center gap-1">
                <button 
                  onClick={handlePlayPause} 
                  className="w-12 h-12 flex items-center justify-center text-white active:scale-90 transition-transform"
                >
                   <span className="material-symbols-outlined text-4xl filled-icon">
                      {status === 'playing' ? 'pause' : 'play_arrow'}
                   </span>
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); close(); }} 
                  className="w-10 h-10 flex items-center justify-center text-white/40 active:scale-90 transition-transform"
                >
                   <span className="material-symbols-outlined text-2xl">close</span>
                </button>
             </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default VerticalVideoPlayerOverlay;
