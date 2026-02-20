import { create } from 'zustand';

export interface Video {
  slug: string;
  title: string;
  thumbnailUrl: string;
  mediaUrl: string;
  channelName: string;
  channelAvatarUrl: string;
  categorySlug: string;
  categoryName: string;
}

export type ViewMode = 'hidden' | 'mini' | 'full';

interface PlayerState {
  // State
  status: 'idle' | 'playing' | 'paused' | 'buffering';
  viewMode: ViewMode;
  currentVideo: Video | null;
  isMuted: boolean;
  progress: number;
  duration: number;
  originRect: { top: number; left: number; width: number; height: number } | null;
  error: string | null;
  
  // Actions
  play: (video: Video, originRect?: { top: number; left: number; width: number; height: number }) => void;
  pause: () => void;
  resume: () => void;
  minimize: () => void;
  maximize: () => void;
  close: () => void;
  setVideo: (video: Video) => void;
  toggleMute: () => void;
  setProgress: (progress: number | ((prev: number) => number)) => void;
  setDuration: (duration: number) => void;
  setError: (error: string | null) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  status: 'idle',
  viewMode: 'hidden',
  currentVideo: null,
  isMuted: false,
  progress: 0,
  duration: 0,
  originRect: null,
  error: null,

  play: (video, originRect) => set({ 
    currentVideo: video, 
    status: 'playing', 
    viewMode: 'full',
    originRect: originRect || null,
    error: null
  }),
  
  pause: () => set({ status: 'paused' }),
  
  resume: () => set({ status: 'playing' }),
  
  minimize: () => set({ viewMode: 'mini' }),
  
  maximize: () => set({ viewMode: 'full' }),
  
  close: () => set({ 
    viewMode: 'hidden', 
    currentVideo: null, 
    status: 'idle', 
    progress: 0,
    error: null
  }),
  
  setVideo: (video) => set({ currentVideo: video, error: null }),
  
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  setProgress: (progress) => set((state) => ({ 
    progress: typeof progress === 'function' ? progress(state.progress) : progress 
  })),
  setDuration: (duration) => set({ duration }),
  setError: (error) => set({ error, status: error ? 'idle' : 'playing' }),
}));
