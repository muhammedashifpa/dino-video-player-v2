import { useRef } from 'react';
import Layout from './components/layout/Layout';
import Header from './components/layout/Header';
import VideoFeed from './components/feed/VideoFeed';
import { type VideoCardProps } from './components/feed/VideoCard';
import { useVideoFeed } from './hooks/useVideoFeed';
import { useScrollVisibility } from './hooks/useScrollVisibility';
import { usePlayerStore } from './store/usePlayerStore';
import VerticalVideoPlayerOverlay from './components/player/VerticalVideoPlayerOverlay';

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

  const isHeaderVisible = !useScrollVisibility(scrollRef);

  const handleVideoClick = (video: VideoCardProps, e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const originRect = {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height
    };

    play({
      slug: video.slug,
      title: video.title,
      thumbnailUrl: video.thumbnailUrl,
      mediaUrl: video.mediaUrl,
      channelName: video.channelName,
      channelAvatarUrl: video.channelAvatarUrl,
      categorySlug: video.categorySlug,
      categoryName: video.categoryName
    }, originRect);
  };

  return (
    <Layout>
      <VerticalVideoPlayerOverlay />
      <Header 
        isVisible={isHeaderVisible}
        categories={categories}
        isLoading={isLoading}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />
      <main className="flex-1 pb-32 pt-[120px] max-w-screen-2xl mx-auto w-full">

        <VideoFeed 
          isLoading={isLoading}
          videos={filteredVideos}
          selectedCategory={selectedCategory}
          onVideoClick={handleVideoClick}
        />
      </main>
    </Layout>
  );
}

export default App;

