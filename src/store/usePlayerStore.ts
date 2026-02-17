import { create } from 'zustand';

export interface Video {
  slug: string;
  title: string;
  thumbnailUrl: string;
  mediaUrl: string;
  channelName: string;
  channelAvatarUrl: string;
  categorySlug: string;
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
  
  // Actions
  play: (video: Video) => void;
  pause: () => void;
  resume: () => void;
  minimize: () => void;
  maximize: () => void;
  close: () => void;
  setVideo: (video: Video) => void;
  toggleMute: () => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  status: 'idle',
  viewMode: 'hidden',
  currentVideo: null,
  isMuted: false,
  progress: 0,
  duration: 0,

  play: (video) => set({ 
    currentVideo: video, 
    status: 'playing', 
    viewMode: 'full' 
  }),
  
  pause: () => set({ status: 'paused' }),
  
  resume: () => set({ status: 'playing' }),
  
  minimize: () => set({ viewMode: 'mini' }),
  
  maximize: () => set({ viewMode: 'full' }),
  
  close: () => set({ 
    viewMode: 'hidden', 
    currentVideo: null, 
    status: 'idle', 
    progress: 0 
  }),
  
  setVideo: (video) => set({ currentVideo: video }),
  
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
}));
