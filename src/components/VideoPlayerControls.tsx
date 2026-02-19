import React, { useState } from 'react';

interface VideoPlayerControlsProps {
  isPlaying: boolean;
  progress: number;
  duration: number;
  onPlayPause: () => void;
  onSkipForward: () => void;
  onSkipBackward: () => void;
  onSeek: (time: number) => void;
  onMinimize: () => void;
  onClose: () => void;
  isVisible: boolean;
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const VideoPlayerControls: React.FC<VideoPlayerControlsProps> = ({
  isPlaying,
  progress,
  duration,
  onPlayPause,
  onSkipForward,
  onSkipBackward,
  onSeek,
  onMinimize,
  onClose,
  isVisible,
}) => {
  const [isSkippingForward, setIsSkippingForward] = useState(false);
  const [isSkippingBackward, setIsSkippingBackward] = useState(false);

  const handleSkipForwardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSkippingForward(true);
    onSkipForward();
    setTimeout(() => setIsSkippingForward(false), 200);
  };

  const handleSkipBackwardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSkippingBackward(true);
    onSkipBackward();
    setTimeout(() => setIsSkippingBackward(false), 200);
  };

  return (
    <div className={`absolute inset-0 flex flex-col justify-between bg-black/30 transition-opacity duration-300 ${
      isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
    }`}>
      {/* Top Controls (Minimize/Settings) */}
      <div className="flex items-center justify-between p-4 bg-linear-to-b from-black/60 to-transparent">
        <button 
          onClick={(e) => { e.stopPropagation(); onMinimize(); }}
          className="flex items-center justify-center rounded-full bg-black/40 p-1.5 text-white backdrop-blur-sm"
        >
          <span className="material-symbols-outlined text-xl">expand_more</span>
        </button>
        <div className="flex gap-4">

          <button 
             onClick={(e) => { e.stopPropagation(); onClose(); }}
             className="text-white hover:text-red-500 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      </div>

      {/* Center Controls (Play/Skip) */}
      <div className="flex-1 flex items-center justify-center gap-12 text-white">
        <button 
          onClick={handleSkipBackwardClick}
          className={`flex items-center justify-center transition-transform active:scale-90 bg-black/20 rounded-full p-3 backdrop-blur-sm ${isSkippingBackward ? 'scale-75 text-primary' : ''}`}
        >
          <span className="material-symbols-outlined text-4xl">replay_10</span>
        </button>
        
        <button 
          onClick={(e) => { e.stopPropagation(); onPlayPause(); }}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-md transition-transform active:scale-95"
        >
          <span className={`material-symbols-outlined text-5xl fill-1`}>
            {isPlaying ? 'pause' : 'play_arrow'}
          </span>
        </button>

        <button 
          onClick={handleSkipForwardClick}
          className={`flex items-center justify-center transition-transform active:scale-90 bg-black/20 rounded-full p-3 backdrop-blur-sm ${isSkippingForward ? 'scale-75 text-primary' : ''}`}
        >
          <span className="material-symbols-outlined text-4xl">forward_10</span>
        </button>
      </div>

      {/* Bottom Progress Bar & Time */}
      <div className="flex flex-col w-full bg-linear-to-t from-black/60 to-transparent pt-8">
        <div className="flex items-center justify-between px-4 pb-3 text-[12px] font-medium text-white/90">
          <div className="flex gap-1.5">
            <span>{formatTime(progress)}</span>
            <span className="text-white/50">/</span>
            <span className="text-white/70">{formatTime(duration)}</span>
          </div>
          {/* Add Fullscreen toggle here later if needed */}
        </div>

        <div 
          className="relative h-1 w-full cursor-pointer group touch-none bg-white/30 hover:h-1.5 transition-all duration-200"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            onSeek(Math.min(Math.max(0, percent * duration), duration));
          }}
        >
           {/* Progress bar background */}
          <div 
            className="absolute top-0 left-0 h-full bg-primary shadow-[0_0_10px_rgba(173,43,238,0.5)] pointer-events-none"
            style={{ width: `${(progress / duration) * 100}%` }}
          ></div>
          {/* Thumb */}
          <div 
            className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 -translate-x-1/2 rounded-full bg-primary border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-md"
            style={{ left: `${(progress / duration) * 100}%` }}
          ></div>
          
          {/* Interactive slider for drag support */}
          <input
            type="range"
            min={0}
            max={duration}
            value={progress}
            onChange={(e) => onSeek(Number(e.target.value))}
            className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerControls;
