import type { Variants } from 'motion/react';

/**
 * Generates animation variants for the main player overlay.
 * Handles transitions between 'full', 'mini', and 'hidden' states.
 * 
 * @param screenHeight - Current window height for positioning.
 * @param originRect - The bounding box of the trigger element for expansion/contraction.
 * @returns Framer motion variants for the overlay container.
 */
export const getOverlayVariants = (screenHeight: number, originRect: any): Variants => ({
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
    top: screenHeight - 92 - 40,
    left: 8,
    width: 'calc(100% - 16px)',
    height: 92,
    opacity: 1,
    borderRadius: 8,
  }
});

/**
 * Generates animation variants for the video element container.
 * Manages dimensions and centering based on the current view mode and screen width.
 * 
 * @param windowWidth - Current window width for desktop layout calculations.
 * @param originRect - The bounding box of the trigger element.
 * @returns Framer motion variants for the video container.
 */
export const getVideoContainerVariants = (windowWidth: number, originRect: any): Variants => ({
  hidden: {
    width: originRect?.width ?? '100%',
    height: originRect?.height ?? '100%',
    left: 0,
    x: 0,
    y: 0,
    borderRadius: 12,
  },
  full: {
    width: windowWidth > 640 ? 'min(100%, 430px)' : '100%',
    height: '100%',
    left: windowWidth > 640 ? '50%' : '0%',
    x: windowWidth > 640 ? '-50%' : '0%',
    y: 0,
    borderRadius: 0,
  },
  mini: {
    width: 112,
    height: 92,
    left: 0,
    x: 0,
    y: 0,
    borderRadius: 0,
  }
});
