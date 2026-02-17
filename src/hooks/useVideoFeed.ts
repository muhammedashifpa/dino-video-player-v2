import { useState, useEffect } from 'react';
import type { VideoCardProps } from '../components/VideoCard';
import { MOCK_DATA } from '../data/mockData';
import { DEFAULT_CATEGORY, LOAD_DELAY } from '../utils/constants';

interface UseVideoFeedReturn {
  videos: VideoCardProps[];
  categories: string[];
  isLoading: boolean;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  filteredVideos: VideoCardProps[];
}

export const useVideoFeed = (): UseVideoFeedReturn => {
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([DEFAULT_CATEGORY]);
  const [videos, setVideos] = useState<VideoCardProps[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(DEFAULT_CATEGORY);

  useEffect(() => {
    const loadData = async () => {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, LOAD_DELAY));

      const loadedCategories = [DEFAULT_CATEGORY, ...MOCK_DATA.categories.map((c) => c.category.name)];
      
      const loadedVideos: VideoCardProps[] = MOCK_DATA.categories.flatMap((c) =>
        c.contents.map((video) => ({
          thumbnailUrl: video.thumbnailUrl,
          duration: '10:00', // Mock duration
          channelAvatarUrl: c.category.iconUrl,
          title: video.title, // Title
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

  const filteredVideos = selectedCategory === DEFAULT_CATEGORY
    ? videos
    : videos.filter((video) => video.channelName === selectedCategory);

  return {
    videos,
    categories,
    isLoading,
    selectedCategory,
    setSelectedCategory,
    filteredVideos,
  };
};
