import React from 'react';
import { type Video } from '../../store/usePlayerStore';

interface MiniPlayerViewProps {
  currentVideo: Video;
  isPlaying: boolean;
  onPlayPause: () => void;
  onClose: () => void;
}

const MiniPlayerView: React.FC<MiniPlayerViewProps> = ({
  currentVideo,
  isPlaying,
  onPlayPause,
  onClose,
}) => {
  return (
    <div className="flex flex-1 items-center justify-between px-3 min-w-0 bg-white/95 dark:bg-background-dark/95 backdrop-blur-xl">
      <div className="flex flex-col gap-0.5 min-w-0 mr-2">
        <span className="text-sm font-medium text-slate-900 dark:text-white truncate">
          {currentVideo.title}
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
          {currentVideo.channelName}
        </span>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPlayPause();
          }}
          className="flex items-center justify-center p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-2xl">
            {isPlaying ? 'pause' : 'play_arrow'}
          </span>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="flex items-center justify-center p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>
      </div>
    </div>
  );
};

export default MiniPlayerView;
