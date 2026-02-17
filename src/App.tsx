import { useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Layout from './components/Layout';
import Header from './components/Header';
import CategoryPills from './components/CategoryPills';
import VideoCard from './components/VideoCard';
import BottomNav from './components/BottomNav';
import SkeletonVideoCard from './components/skeletons/SkeletonVideoCard';
import { useVideoFeed } from './hooks/useVideoFeed';
import { useScrollVisibility } from './hooks/useScrollVisibility';

function App() {
  const scrollRef = useRef<HTMLElement>(null);
  
  const { 
    categories, 
    isLoading, 
    selectedCategory, 
    setSelectedCategory, 
    filteredVideos 
  } = useVideoFeed();

  const hidden = useScrollVisibility(scrollRef);

  return (
    <Layout>
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
                  <VideoCard {...video} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </main>
      <BottomNav />
    </Layout>
  );
}

export default App;
