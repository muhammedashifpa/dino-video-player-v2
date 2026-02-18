import React from 'react';
import { useSpring, useMotionValue } from 'motion/react';

interface AnimatedCounterProps {
  value: number;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ value }) => {
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { stiffness: 50, damping: 15 });
  const ref = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  React.useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Intl.NumberFormat('en-US', { 
          notation: "compact", 
          maximumFractionDigits: 1,
          minimumFractionDigits: 1 
        }).format(Math.floor(latest));
      }
    });
  }, [springValue]);

  return <span ref={ref} className="text-xs tabular-nums text-right min-w-[4ch]" />;
};

export default AnimatedCounter;
