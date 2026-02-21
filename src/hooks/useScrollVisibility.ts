import { useState } from 'react';
import { useScroll, useMotionValueEvent } from 'motion/react';
import { SCROLL_THRESHOLD } from '../utils/constants';

/**
 * A custom hook that tracks the vertical scroll position of a container or the window.
 * It determines whether the user is scrolling down past a specific threshold,
 * which is useful for hiding/showing UI elements like headers or navigations.
 * 
 * @param {React.RefObject<HTMLElement | null>} [elementRef] - Optional ref to a scrollable container. If not provided, it tracks window scroll.
 * @returns {boolean} A boolean indicating whether the UI should be hidden (true when scrolling down past threshold).
 */
export const useScrollVisibility = (elementRef?: React.RefObject<HTMLElement | null>) => {
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll(
    elementRef ? { container: elementRef } : {}
  );

  useMotionValueEvent(scrollY, 'change', (current) => {
    const previous = scrollY.getPrevious() ?? 0;
    // Hide when scrolling down past threshold, show when scrolling up
    if (current > previous && current > SCROLL_THRESHOLD) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return hidden;
};
