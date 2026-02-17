import React from 'react';

interface VideoPlayerControlsProps {
  isPlaying: boolean;
  progress: number;
  duration: number;
  onPlayPause: () => void;
  onSkipForward: () => void;
  onSkipBackward: () => void;
  onMinimize: () => void;
  onClose: () => void;
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
  onMinimize,
  onClose,
}) => {
  return (
    <div className="absolute inset-0 flex flex-col justify-between bg-black/30 p-4 transition-opacity duration-300">
      {/* Top Controls (Minimize/Settings) */}
      <div className="flex items-center justify-between">
        <button 
          onClick={(e) => { e.stopPropagation(); onMinimize(); }}
          className="flex items-center justify-center rounded-full bg-black/40 p-1.5 text-white"
        >
          <span className="material-symbols-outlined text-xl">expand_more</span>
        </button>
        <div className="flex gap-4">
          <button className="text-white hover:text-primary transition-colors">
            <span className="material-symbols-outlined">cast</span>
          </button>
          <button className="text-white hover:text-primary transition-colors">
            <span className="material-symbols-outlined">settings</span>
          </button>
          <button 
             onClick={(e) => { e.stopPropagation(); onClose(); }}
             className="text-white hover:text-red-500 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      </div>

      {/* Center Controls (Play/Skip) */}
      <div className="flex items-center justify-center gap-12 text-white">
        <button 
          onClick={(e) => { e.stopPropagation(); onSkipBackward(); }}
          className="flex items-center justify-center transition-transform active:scale-90"
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
          onClick={(e) => { e.stopPropagation(); onSkipForward(); }}
          className="flex items-center justify-center transition-transform active:scale-90"
        >
          <span className="material-symbols-outlined text-4xl">forward_10</span>
        </button>
      </div>

      {/* Bottom Progress Bar & Time */}
      <div className="flex flex-col gap-2">
        <div className="relative h-1 w-full rounded-full bg-white/30 cursor-pointer group">
           {/* Progress bar background */}
          <div 
            className="absolute top-0 left-0 h-full rounded-full bg-primary shadow-[0_0_10px_rgba(173,43,238,0.8)]"
            style={{ width: `${(progress / duration) * 100}%` }}
          ></div>
          {/* Thumb */}
          <div 
            className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-primary border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ left: `${(progress / duration) * 100}%` }}
          ></div>
        </div>
        
        <div className="flex items-center justify-between px-1 text-[10px] font-medium text-white/90">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerControls;
