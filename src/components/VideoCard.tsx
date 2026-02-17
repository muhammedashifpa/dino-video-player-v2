import React from 'react';

export interface VideoCardProps {
  thumbnailUrl: string;
  duration: string;
  channelAvatarUrl: string;
  title: string;
  channelName: string;
  views: string;
  uploadedAt: string;
}

const VideoCard: React.FC<VideoCardProps> = ({
  thumbnailUrl,
  duration,
  channelAvatarUrl,
  title,
  channelName,
  views,
  uploadedAt,
}) => {
  return (
    <div className="mb-6 group cursor-pointer">
      <div className="relative w-full aspect-video bg-surface-dark overflow-hidden">
        <img
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          src={thumbnailUrl}
        />
        <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
          {duration}
        </span>
      </div>
      <div className="flex gap-3 p-3">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex-shrink-0 border border-primary/30 overflow-hidden">
          <img
            alt={channelName}
            className="w-full h-full object-cover"
            src={channelAvatarUrl}
          />
        </div>
        <div className="flex flex-col flex-1">
          <h3 className="text-sm font-bold leading-tight text-slate-900 dark:text-white line-clamp-2">
            {title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {channelName} • {views} • {uploadedAt}
          </p>
        </div>
        <button className="text-slate-400 hover:text-primary transition-colors self-start">
          <span className="material-symbols-outlined text-xl">more_vert</span>
        </button>
      </div>
    </div>
  );
};

export default VideoCard;
