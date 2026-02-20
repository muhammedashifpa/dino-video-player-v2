import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import type { Video } from '../../store/usePlayerStore';

interface AutoPlayOverlayProps {
  nextVideo: Video;
  onCancel: () => void;
  onPlayNow: () => void;
  onComplete: () => void;
}

const AutoPlayOverlay: React.FC<AutoPlayOverlayProps> = ({
  nextVideo,
  onCancel,
  onPlayNow,
  onComplete,
}) => {
  const [timeLeft, setTimeLeft] = useState(5);

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center"
    >
      <div className="mb-8 relative">
        <div className="w-24 h-24 rounded-full flex items-center justify-center relative overflow-hidden">
          {/* Animated Progress Ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 96 96">
            {/* Track Circle */}
            <circle
              cx="48"
              cy="48"
              r="44"
              fill="transparent"
              stroke="white"
              strokeOpacity="0.1"
              strokeWidth="4"
            />
            {/* Animated Circle */}
            <motion.circle
              cx="48"
              cy="48"
              r="44"
              fill="transparent"
              stroke="white"
              strokeWidth="4"
              strokeDasharray="276.46"
              strokeLinecap="round"
              initial={{ strokeDashoffset: 0 }}
              animate={{ strokeDashoffset: 276.46 }}
              transition={{ duration: 5, ease: "linear" }}
            />
          </svg>
          <span className="text-4xl font-black text-white relative z-10">{timeLeft}</span>
        </div>
      </div>

      <div className="mb-8 max-w-xs">
        <p className="text-white/60 text-xs font-black uppercase tracking-[0.2em] mb-2">Up Next</p>
        <h3 className="text-white text-xl font-bold line-clamp-2">{nextVideo.title}</h3>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-[240px]">
        <button
          onClick={onPlayNow}
          className="w-full py-4 rounded-full bg-primary text-white font-bold text-sm shadow-[0_0_20px_rgba(173,43,238,0.4)] active:scale-95 transition-all"
        >
          Play Now
        </button>
        <button
          onClick={onCancel}
          className="w-full py-4 rounded-full bg-white/10 text-white font-bold text-sm hover:bg-white/20 active:scale-95 transition-all"
        >
          Cancel
        </button>
      </div>
    </motion.div>
  );
};

export default AutoPlayOverlay;
