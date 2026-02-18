import { useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Layout from './components/Layout';
import Header from './components/Header';
import CategoryPills from './components/CategoryPills';
import VideoCard, { type VideoCardProps } from './components/VideoCard';
import SkeletonVideoCard from './components/skeletons/SkeletonVideoCard';
import { useVideoFeed } from './hooks/useVideoFeed';
import { useScrollVisibility } from './hooks/useScrollVisibility';
import { usePlayerStore } from './store/usePlayerStore';
import VideoPlayerOverlay from './components/VideoPlayerOverlay';

function App() {
  const scrollRef = useRef<HTMLElement>(null);
  const play = usePlayerStore((state) => state.play);
  
  const { 
    categories, 
    isLoading, 
    selectedCategory, 
    setSelectedCategory, 
    filteredVideos 
  } = useVideoFeed();

  const hidden = useScrollVisibility(scrollRef);

  const handleVideoClick = (video: VideoCardProps) => {
    // Transform video data to match store Video type
    // In a real app, types should be consistent
    play({
      slug: video.slug || video.title, // Use slug if available
      title: video.title,
      thumbnailUrl: video.thumbnailUrl,
      // Fallback to sample video for YouTube links since <video> tag doesn't support them
      mediaUrl: video.mediaUrl && !video.mediaUrl.includes('youtube') 
        ? video.mediaUrl 
        : 'https://www.w3schools.com/html/mov_bbb.mp4',
      channelName: video.channelName,
      channelAvatarUrl: video.channelAvatarUrl,
      categorySlug: video.categorySlug || 'all'
    });
  };

  return (
    <Layout>
      <VideoPlayerOverlay />
      <motion.div
        variants={{
          visible: { y: 0 },
          hidden: { y: '-100%' },
        }}
        animate={hidden ? 'hidden' : 'visible'}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="absolute top-0 left-0 w-full z-30 flex flex-col"
      >
        <Header />
        <CategoryPills 
          categories={categories} 
          isLoading={isLoading} 
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </motion.div>
      <main ref={scrollRef} className="flex-1 overflow-y-auto pb-32 pt-[120px]">
        {isLoading ? (
          // Render Skeletons in a grid or list
          Array.from({ length: 6 }).map((_, index) => (
            <SkeletonVideoCard key={index} />
          ))
        ) : (
          // Render Actual Videos
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    duration: 0.3,
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
              {filteredVideos.map((video, index) => (
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
                  <VideoCard {...video} onClick={() => handleVideoClick(video)} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </main>
    </Layout>
  );
}

export default App;
