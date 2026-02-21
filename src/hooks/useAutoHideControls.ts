import { useState, useEffect, useRef } from 'react';

/**
 * Props for the useAutoHideControls hook.
 */
interface UseAutoHideControlsProps {
  /** The current view mode of the player ('full', 'mini', 'hidden') */
  viewMode: string;
  /** The current playback status of the video */
  status: string;
  /** Any current error state */
  error: any;
  /** Duration in milliseconds before controls are hidden. Defaults to 2000ms. */
  autoHideDuration?: number;
}

/**
 * A hook that manages the visibility of video controls, automatically hiding them
 * after a period of inactivity during playback in full-screen mode.
 * 
 * @param props - The configuration properties for the hook.
 * @returns An object containing showControls state, and functions to update visibility.
 */
export const useAutoHideControls = ({
  viewMode,
  status,
  error,
  autoHideDuration = 2000
}: UseAutoHideControlsProps) => {
  const [showControls, setShowControls] = useState(true);
  const [lastInteractionTime, setLastInteractionTime] = useState(Date.now());
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetAutoHideTimer = () => {
    setShowControls(true);
    setLastInteractionTime(Date.now());
  };

  useEffect(() => {
    if (showControls && viewMode === 'full' && status === 'playing' && !error) {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, autoHideDuration);
    }
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [showControls, viewMode, status, error, lastInteractionTime, autoHideDuration]);

  return {
    showControls,
    setShowControls,
    resetAutoHideTimer
  };
};
