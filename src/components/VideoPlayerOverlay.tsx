import React from 'react';
import { usePlayerStore } from '../store/usePlayerStore';
import VideoPlayerControls from './VideoPlayerControls';
import { useVideoFeed } from '../hooks/useVideoFeed';
import RelatedVideoCard from './RelatedVideoCard';

const VideoPlayerOverlay: React.FC = () => {
  const { 
    viewMode, 
    currentVideo, 
    status, 
    minimize, 
    close,
    play, 
    pause 
  } = usePlayerStore();

  const { videos } = useVideoFeed();

  if (viewMode === 'hidden' || !currentVideo) return null;

  const isPlaying = status === 'playing';

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      if (currentVideo) play(currentVideo);
    }
  };

  // Filter related videos (same category, exclude current)
  // Note: simplistic filtering for now since mock data structure varies
  const relatedVideos = videos
    .filter(v => v.title !== currentVideo.title && v.categorySlug === currentVideo.categorySlug) // Exclude current and match category
    .slice(0, 5); // Limit to 5 for now

  const handleRelatedClick = (video: any) => {
    play({
        slug: video.title,
        title: video.title,
        thumbnailUrl: video.thumbnailUrl,
        mediaUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        channelName: video.channelName,
        channelAvatarUrl: video.channelAvatarUrl,
        categorySlug: video.categorySlug 
    });
  };

  // Mock progress and duration for now
  const progress = 262; // 04:22
  const duration = 600; // 10:00

  return (
    <div className={`fixed inset-0 z-50 flex flex-col bg-background-dark text-white transition-all duration-300 ${viewMode === 'mini' ? 'top-auto left-auto right-4 bottom-24 w-80 h-48 rounded-lg shadow-2xl overflow-hidden border border-white/10' : ''}`}>
      
      {/* Drag Handle (Full Screen Only) */}
      {viewMode === 'full' && (
        <div className="flex w-full justify-center pt-3 pb-1 shrink-0 z-50 absolute top-0 left-0 bg-gradient-to-b from-black/50 to-transparent">
          <div className="h-1.5 w-12 rounded-full bg-white/20"></div>
        </div>
      )}

      {/* Video Player Section */}
      <div className={`relative w-full bg-black shrink-0 overflow-hidden group ${viewMode === 'full' ? 'aspect-video mt-0' : 'h-full'}`}>
        
        {/* Main Video Background (Mock) */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-80" 
          style={{ backgroundImage: `url('${currentVideo.thumbnailUrl}')` }}
        ></div>

        {/* Video Player Controls */}
        <VideoPlayerControls 
          isPlaying={isPlaying}
          progress={progress}
          duration={duration}
          onPlayPause={handlePlayPause}
          onSkipForward={() => {}} 
          onSkipBackward={() => {}}
          onMinimize={minimize}
          onClose={close}
        />
      </div>

      {/* Metadata & Related Videos (Hidden in Mini Mode) */}
      {viewMode === 'full' && (
        <>
          <div className="flex flex-col gap-4 py-4 shrink-0 border-b border-white/5 bg-background-dark">
            <div className="flex flex-col gap-1 px-4">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-white">
                {currentVideo.title}
              </h1>
              <p className="text-xs text-slate-400">1.2M views • 2 hours ago</p>
            </div>

            <div className="flex items-center justify-between gap-4 px-4 overflow-x-auto scrollbar-none">
              <div className="flex items-center gap-2 shrink-0">
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-purple-400 p-[2px]">
                   <div className="h-full w-full rounded-full bg-background-dark p-[1px]">
                     <img 
                       alt={currentVideo.channelName} 
                       className="h-full w-full rounded-full object-cover" 
                       src={currentVideo.channelAvatarUrl}
                     />
                   </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-white">{currentVideo.channelName}</span>
                  <span className="text-[10px] text-slate-400">840K Subscribers</span>
                </div>
              </div>
              
              {/* Actions shifted here */}
              <div className="flex items-center gap-2  py-1">
                <div className="flex shrink-0 items-center gap-3 rounded-full bg-white/5 px-4 py-2">
                  <button className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-lg">thumb_up</span>
                    <span className="text-xs">42K</span>
                  </button>
                  <div className="h-4 w-[1px] bg-white/10"></div>
                  <button className="flex items-center">
                     <span className="material-symbols-outlined text-lg">thumb_down</span>
                  </button>
                </div>
                 <div className="flex shrink-0 items-center gap-2 rounded-full bg-white/5 px-4 py-2">
                <span className="material-symbols-outlined text-lg">share</span>
                <span className="text-xs">Share</span>
              </div>
               <div className="flex shrink-0 items-center gap-2 rounded-full bg-white/5 px-4 py-2">
                <span className="material-symbols-outlined text-lg">download</span>
                <span className="text-xs">Download</span>
              </div>
               <div className="flex shrink-0 items-center gap-2 rounded-full bg-white/5 px-4 py-2">
                <span className="material-symbols-outlined text-lg">playlist_add</span>
                <span className="text-xs">Save</span>
              </div>
            </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-background-dark/50 px-4 pt-4 scrollbar-none pb-24">
             <div className="flex items-center gap-2 mb-4">
               <span className="text-sm font-bold uppercase tracking-widest text-slate-500">Up Next from</span>
               <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold text-white border border-white/10 uppercase tracking-widest shadow-sm">
                 {currentVideo.channelName}
               </span>
             </div>
             <div className="space-y-6 pb-24">
               {relatedVideos.map((video, idx) => (
                 <RelatedVideoCard 
                   key={`${video.title}-${idx}`} 
                   video={video as any} // Cast for now as types allow
                   onClick={() => handleRelatedClick(video)}
                 />
               ))}
             </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VideoPlayerOverlay;
