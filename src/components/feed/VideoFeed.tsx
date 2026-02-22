import { motion, AnimatePresence } from 'motion/react';
import VideoCard, { type VideoCardProps } from './VideoCard';
import SkeletonVideoCard from '../skeletons/SkeletonVideoCard';

interface VideoFeedProps {
  isLoading: boolean;
  videos: VideoCardProps[];
  selectedCategory: string;
  onVideoClick: (video: VideoCardProps, e: React.MouseEvent) => void;
}

const VideoFeed = ({ isLoading, videos, selectedCategory, onVideoClick }: VideoFeedProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 px-4 overflow-hidden">
        {Array.from({ length: 12 }).map((_, index) => (
          <SkeletonVideoCard key={index} />
        ))}
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={selectedCategory}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 px-4 overflow-hidden"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              duration: 0.3,
              staggerChildren: 0.05
            },
          },
          exit: {
            opacity: 0,
            transition: {
              duration: 0.2,
            },
          },
        }}
      >
        {videos.map((video, index) => (
          <motion.div
            key={`${video.title}-${index}`}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <VideoCard {...video} onClick={(e) => onVideoClick(video, e)} />
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
};

export default VideoFeed;
