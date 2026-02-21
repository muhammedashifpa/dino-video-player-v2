import { useState, useEffect } from 'react';
import type { VideoCardProps } from '../components/feed/VideoCard';
import { MOCK_DATA } from '../data/mockData';
import { DEFAULT_CATEGORY, LOAD_DELAY } from '../utils/constants';

/**
 * Return type for the useVideoFeed hook.
 */
interface UseVideoFeedReturn {
  /** The full list of all loaded videos */
  videos: VideoCardProps[];
  /** Categorized list of unique content types (including 'All') */
  categories: string[];
  /** Loading state of the feed data */
  isLoading: boolean;
  /** Currently active filter category */
  selectedCategory: string;
  /** Function to update the active filter category */
  setSelectedCategory: (category: string) => void;
  /** The list of videos filtered by the selected category */
  filteredVideos: VideoCardProps[];
}

/**
 * A custom hook that manages the video feed data, including fetching from mock sources,
 * categorizing content, and handling filtering logic.
 * 
 * @param {boolean} [skipDelay=false] - If true, bypasses the artificial network latency simulation.
 * @returns {UseVideoFeedReturn} An object containing video data, categories, and filter management functions.
 */
export const useVideoFeed = (skipDelay = false): UseVideoFeedReturn => {
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([DEFAULT_CATEGORY]);
  const [videos, setVideos] = useState<VideoCardProps[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(DEFAULT_CATEGORY);

  useEffect(() => {
    const loadData = async () => {
      // Simulate network delay to demonstrate loading skeletons
      if (!skipDelay) {
        await new Promise((resolve) => setTimeout(resolve, LOAD_DELAY));
      }

      const loadedCategories = [DEFAULT_CATEGORY, ...MOCK_DATA.categories.map((c) => c.category.name)];
      
      const loadedVideos: VideoCardProps[] = MOCK_DATA.categories.flatMap((c) =>
        c.contents.map((video) => ({
          thumbnailUrl: video.thumbnailUrl,
          duration: '10:00', // Mock duration
          channelAvatarUrl: c.category.iconUrl,
          title: video.title,
          channelName: c.category.name,
          views: `${Math.floor(Math.random() * 900 + 100)}K views`,
          uploadedAt: '2 days ago', // Mock date
          categorySlug: c.category.slug,
          categoryName: c.category.name,
          slug: video.slug,
          mediaUrl: video.mediaUrl,
        }))
      );

      // Shuffle videos for a more randomized, dynamic "feed-like" feel
      const shuffledVideos = loadedVideos.sort(() => Math.random() - 0.5);

      setCategories(loadedCategories);
      setVideos(shuffledVideos);
      setIsLoading(false);
    };

    loadData();
  }, [skipDelay]);

  // Derived state: filter videos based on the user's selection
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
