import { useState, useEffect, type RefObject } from 'react';

/**
 * A hook that provides Picture-in-Picture (PiP) functionality for a video element.
 * It tracks the PiP state and provides functions to toggle and exit PiP mode.
 * 
 * @param videoRef - A reference to the HTMLVideoElement.
 * @returns An object containing PiP state and control functions.
 */
export const usePictureInPicture = (videoRef: RefObject<HTMLVideoElement | null>) => {
  const [isPiPActive, setIsPiPActive] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnterPiP = () => setIsPiPActive(true);
    const handleLeavePiP = () => setIsPiPActive(false);

    video.addEventListener('enterpictureinpicture', handleEnterPiP);
    video.addEventListener('leavepictureinpicture', handleLeavePiP);

    if ('autoPictureInPicture' in video) {
      (video as any).autoPictureInPicture = true;
    }

    return () => {
      video.removeEventListener('enterpictureinpicture', handleEnterPiP);
      video.removeEventListener('leavepictureinpicture', handleLeavePiP);
    };
  }, [videoRef]);

  const togglePiP = async () => {
    if (!videoRef.current) return;

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (document.pictureInPictureEnabled) {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (error) {
      console.error('PiP failed:', error);
    }
  };

  const exitPiP = async () => {
    if (document.pictureInPictureElement && videoRef.current && document.pictureInPictureElement === videoRef.current) {
      try {
        await document.exitPictureInPicture();
      } catch (error) {
        console.error('Failed to exit PiP:', error);
      }
    }
  };

  return {
    isPiPActive,
    togglePiP,
    exitPiP
  };
};
