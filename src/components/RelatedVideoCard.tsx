import React from 'react';
import { type Video } from '../store/usePlayerStore';

interface RelatedVideoCardProps {
  video: Video;
  onClick: () => void;
}

const RelatedVideoCard: React.FC<RelatedVideoCardProps> = ({ video, onClick }) => {
  return (
    <div className="flex gap-3 cursor-pointer group" onClick={onClick}>
      <div className="relative aspect-video w-36 shrink-0 overflow-hidden rounded-lg bg-slate-800">
        <img 
          alt={video.title} 
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" 
          src={video.thumbnailUrl} 
        />
        <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 text-[10px] font-medium text-white">
          10:00
        </span>
      </div>
      <div className="flex flex-col gap-1 overflow-hidden">
        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-white group-hover:text-primary transition-colors">
          {video.title}
        </h3>
        <p className="text-[11px] text-slate-400">
          {video.channelName} • 10K views
        </p>
      </div>
    </div>
  );
};

export default RelatedVideoCard;
