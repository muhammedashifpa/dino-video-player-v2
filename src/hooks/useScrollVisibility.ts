import { useState } from 'react';
import { useScroll, useMotionValueEvent } from 'motion/react';
import { SCROLL_THRESHOLD } from '../utils/constants';

export const useScrollVisibility = (elementRef?: React.RefObject<HTMLElement | null>) => {
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll(
    elementRef ? { container: elementRef } : {}
  );

  useMotionValueEvent(scrollY, 'change', (current) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (current > previous && current > SCROLL_THRESHOLD) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return hidden;
};
