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
import VerticalVideoPlayerOverlay from './components/VerticalPlayer/VerticalVideoPlayerOverlay';

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

  const handleVideoClick = (video: VideoCardProps, e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const originRect = {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height
    };

    play({
      slug: video.slug || video.title,
      title: video.title,
      thumbnailUrl: video.thumbnailUrl,
      mediaUrl: video.mediaUrl || '',
      channelName: video.channelName,
      channelAvatarUrl: video.channelAvatarUrl,
      categorySlug: video.categorySlug || 'all',
      categoryName: video.categoryName || 'Artificial Intelligence'
    }, originRect);
  };

  return (
    <Layout>
      <VerticalVideoPlayerOverlay />
      <motion.div
        variants={{
          visible: { y: 0 },
          hidden: { y: '-100%' },
        }}
        animate={hidden ? 'hidden' : 'visible'}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed top-0 left-0 w-full z-30 flex flex-col"
      >
        <Header />
        <CategoryPills 
          categories={categories} 
          isLoading={isLoading} 
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </motion.div>
      <main className="flex-1 pb-32 pt-[120px]">
        {isLoading ? (
          // Render Skeletons in a grid or list
          <div className="grid grid-cols-2 gap-4 px-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonVideoCard key={index} />
            ))}
          </div>
        ) : (
          // Render Actual Videos
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="grid grid-cols-2 gap-4 px-4"
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
                  <VideoCard {...video} onClick={(e) => handleVideoClick(video, e)} />
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
