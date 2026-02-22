import React, { useState, useRef, useEffect, type RefObject } from 'react';
import type { Video } from '../store/usePlayerStore';

/**
 * Props for the useVideoPlayback hook.
 */
interface UseVideoPlaybackProps {
  /** Reference to the video element */
  videoRef: RefObject<HTMLVideoElement | null>;
  /** The video object currently being played */
  currentVideo: Video | null;
  /** Playback status (e.g., 'playing', 'paused', 'loading') */
  status: string;
  /** Total duration of the current video in seconds */
  duration: number;
  /** Function to start playing a video */
  play: (video: Video) => void;
  /** Function to pause the current video */
  pause: () => void;
  /** Function to update the current playback progress */
  setProgress: (progress: number) => void;
  /** Function to set the video duration */
  setDuration: (duration: number) => void;
  /** Function to set or clear error messages */
  setError: (error: string | null) => void;
  /** Optional callback triggered on user interactions (e.g., to reset auto-hide timer) */
  onInteraction?: () => void;
}

/**
 * A hook that encapsulates all video playback logic, including time updates,
 * metadata loading, seeking, and playback controls (play, pause, skip).
 * 
 * @param props - Configuration properties for video playback.
 * @returns An object with playback states and event handlers.
 */
export const useVideoPlayback = ({
  videoRef,
  currentVideo,
  status,
  duration,
  play,
  pause,
  setProgress,
  setDuration,
  setError,
  onInteraction
}: UseVideoPlaybackProps) => {
  const [isSeeking, setIsSeeking] = useState(false);
  const seekTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync video playback status
  useEffect(() => {
    if (videoRef.current) {
      if (status === 'playing') {
        videoRef.current.play().catch((error) => {
          if (error.name === 'NotAllowedError') {
            setError("Autoplay blocked. Please click play to start the video.");
          }
          pause();
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [status, currentVideo, pause, videoRef]);

  const handleTimeUpdate = () => {
    if (videoRef.current && !isSeeking) {
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
    onInteraction?.();
    if (status === 'playing') {
      pause();
    } else if (currentVideo) {
      play(currentVideo);
    }
  };

  const handleSkipForward = (e: React.MouseEvent) => {
    e.stopPropagation();
    onInteraction?.();
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(videoRef.current.currentTime + 10, duration);
    }
  };

  const handleSkipBackward = (e: React.MouseEvent) => {
    e.stopPropagation();
    onInteraction?.();
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
    }
  };

  const handleSeekChange = (time: number) => {
    setProgress(time);
    
    if (seekTimeoutRef.current) clearTimeout(seekTimeoutRef.current);
    
    seekTimeoutRef.current = setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = time;
      }
    }, 100);
  };

  const handleSeekStart = () => {
    setIsSeeking(true);
  };

  const handleSeekEnd = () => {
    setIsSeeking(false);
  };

  const handleRetry = (e: React.MouseEvent) => {
    e.stopPropagation();
    setError(null);
    if (videoRef.current) {
      videoRef.current.load();
      if (currentVideo) play(currentVideo);
    }
  };

  return {
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
  };
};
