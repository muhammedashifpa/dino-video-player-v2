import { motion } from 'motion/react';
import CategoryTag from './CategoryTag';


export interface VideoCardProps {
  thumbnailUrl: string;
  duration: string;
  channelAvatarUrl: string;
  title: string;
  channelName: string;
  views: string;
  uploadedAt: string;
  slug: string;
  mediaUrl: string;
  categorySlug: string;
  categoryName: string;
  onClick?: (e: React.MouseEvent) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({
  thumbnailUrl,
  duration,
  title,
  onClick,
  categorySlug = 'General',
}) => {
  return (
    <motion.div 
      className="mb-4 group cursor-pointer" 
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <div className="relative w-full aspect-9/16 bg-surface-dark overflow-hidden rounded-lg shadow-md">
        <img
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          src={thumbnailUrl}
        />
        <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[10px] font-bold text-white uppercase tracking-wider">
          {duration}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-linear-to-t from-black/80 to-transparent pointer-events-none"></div>
      </div>
      <div className="px-1 mt-2">
        <h3 className="text-sm font-semibold leading-snug text-slate-900 dark:text-slate-100 line-clamp-2">
          {title}
        </h3>
        <CategoryTag label={categorySlug} className="mt-1" />
      </div>
    </motion.div>
  );
};

export default VideoCard;
