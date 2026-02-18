import { motion } from 'motion/react';
import ChannelAvatar from './ui/ChannelAvatar';

export interface VideoCardProps {
  thumbnailUrl: string;
  duration: string;
  channelAvatarUrl: string;
  title: string;
  channelName: string;
  views: string;
  uploadedAt: string;
  onClick?: () => void;
  categorySlug?: string;
  slug?: string;
}

const VideoCard: React.FC<VideoCardProps> = ({
  thumbnailUrl,
  duration,
  channelAvatarUrl,
  title,
  channelName,
  views,
  uploadedAt,
  onClick,
}) => {
  return (
    <motion.div 
      className="mb-6 group cursor-pointer" 
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
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
        <ChannelAvatar 
          src={channelAvatarUrl} 
          name={channelName} 
        />
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
    </motion.div>
  );
};

export default VideoCard;
