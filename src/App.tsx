import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'motion/react';
import Layout from './components/Layout';
import Header from './components/Header';
import CategoryPills from './components/CategoryPills';
import VideoCard, { type VideoCardProps } from './components/VideoCard';
import BottomNav from './components/BottomNav';
import SkeletonVideoCard from './components/skeletons/SkeletonVideoCard';
import { MOCK_DATA } from './data/mockData';

function App() {
  const scrollRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll({
    container: scrollRef,
  });
  const [hidden, setHidden] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [videos, setVideos] = useState<VideoCardProps[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useMotionValueEvent(scrollY, 'change', (current) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (current > previous && current > 50) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  useEffect(() => {
    const loadData = async () => {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const loadedCategories = ['All', ...MOCK_DATA.categories.map((c) => c.category.name)];
      
      const loadedVideos: VideoCardProps[] = MOCK_DATA.categories.flatMap((c) =>
        c.contents.map((video) => ({
          thumbnailUrl: video.thumbnailUrl,
          duration: '10:00', // Mock duration as it's missing in data
          channelAvatarUrl: c.category.iconUrl,
          title: video.title,
          channelName: c.category.name,
          views: `${Math.floor(Math.random() * 900 + 100)}K views`,
          uploadedAt: '2 days ago', // Mock date
        }))
      );

      // Shuffle videos for a more "feed-like" feel
        const shuffledVideos = loadedVideos.sort(() => Math.random() - 0.5);

      setCategories(loadedCategories);
      setVideos(shuffledVideos);
      setIsLoading(false);
    };

    loadData();
  }, []);

  const filteredVideos = selectedCategory === 'All' 
    ? videos 
    : videos.filter((video) => video.channelName === selectedCategory);

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
          // Render Skeletons
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
