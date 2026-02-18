import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { type Video } from '../../store/usePlayerStore';
import AnimatedCounter from '../AnimatedCounter';
import ChannelAvatar from '../ui/ChannelAvatar';
import ActionButton from '../ui/ActionButton';

interface OverlayMetadataProps {
  currentVideo: Video;
  likeCount: number;
}

const OverlayMetadata: React.FC<OverlayMetadataProps> = ({ currentVideo, likeCount }) => {
  return (
    <div className="flex flex-col gap-4 py-4 shrink-0 border-b border-black/5 dark:border-white/5">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentVideo.title}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-1 px-4"
        >
          <h1 className="text-xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white">
            {currentVideo.title}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            1.2M views • 2 hours ago
          </p>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentVideo.categorySlug}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-between gap-4 px-4 overflow-x-auto scrollbar-none"
        >
          <div className="flex items-center gap-2 shrink-0">
            <ChannelAvatar 
              src={currentVideo.channelAvatarUrl} 
              name={currentVideo.channelName} 
              highlight 
            />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {currentVideo.channelName}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                840K Subscribers
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 py-1">
            <ActionButton icon="thumb_up">
              <AnimatedCounter value={likeCount} />
              <div className="h-4 w-px bg-black/10 dark:bg-white/10 mx-2"></div>
              <span className="material-symbols-outlined text-lg">thumb_down</span>
            </ActionButton>
            
            <ActionButton icon="share" label="Share" />
            <ActionButton icon="download" label="Download" />
            <ActionButton icon="playlist_add" label="Save" />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default OverlayMetadata;
