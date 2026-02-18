import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { type Video } from '../../store/usePlayerStore';
import { type VideoCardProps } from '../VideoCard';
import RelatedVideoCard from '../RelatedVideoCard';
import CategoryPills from '../CategoryPills';
import StickyHeader from '../ui/StickyHeader';

interface RelatedVideosListProps {
  currentVideo: Video;
  relatedVideos: VideoCardProps[];
  categories: string[];
  selectedCategory: string;
  isLoading: boolean;
  onSelectCategory: (category: string) => void;
  onVideoClick: (video: VideoCardProps) => void;
}

const RelatedVideosList: React.FC<RelatedVideosListProps> = ({
  currentVideo,
  relatedVideos,
  categories,
  selectedCategory,
  isLoading,
  onSelectCategory,
  onVideoClick,
}) => {
  return (
    <div className="relative">
      <StickyHeader>
        <CategoryPills
          categories={categories}
          isLoading={isLoading}
          selectedCategory={selectedCategory}
          onSelect={onSelectCategory}
        />
      </StickyHeader>
      <AnimatePresence mode="wait">
        <motion.div
          key={`${selectedCategory}-${currentVideo.title}`}
          className="space-y-6 px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {relatedVideos.map((video, idx) => (
            <motion.div
              key={`${video.title}-${idx}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <RelatedVideoCard
                video={{
                  ...video,
                  slug: video.slug || video.title,
                  mediaUrl: '',
                  categorySlug: video.categorySlug || 'all',
                } as Video}
                onClick={() => onVideoClick(video)}
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default RelatedVideosList;
