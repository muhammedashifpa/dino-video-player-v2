import React from 'react';
import { PROFILE_IMAGE_URL } from '../utils/constants';

const NAV_ITEMS = [
  { label: 'Home', icon: 'home', filled: true },
  { label: 'Explore', icon: 'explore' },
  { label: 'Subs', icon: 'subscriptions' },
  { label: 'Library', icon: 'video_library' },
];

const BottomNav: React.FC = () => {
  return (
    <nav 
      className="bg-background-light dark:bg-surface-dark/95 backdrop-blur-md border-t border-border-dark/40 px-6 pt-2 pb-6 flex justify-between items-center sticky bottom-0 z-40"
      style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}
    >
      {NAV_ITEMS.map((item) => (
        <a 
          key={item.label}
          className={`flex flex-col items-center gap-1 cursor-pointer p-1 rounded-lg transition-colors ${item.filled ? 'text-primary hover:bg-white/5' : 'text-slate-500 dark:text-slate-400 hover:text-primary hover:bg-white/5'}`} 
          href="#"
        >
          <span className={`material-symbols-outlined ${item.filled ? 'filled-icon' : ''}`}>
            {item.icon}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider">
            {item.label}
          </span>
        </a>
      ))}
      
      <a className="flex flex-col items-center gap-1 text-slate-500 dark:text-slate-400 cursor-pointer hover:text-primary hover:bg-white/5 p-1 rounded-lg transition-colors" href="#">
        <div className="w-6 h-6 rounded-full border border-slate-700 overflow-hidden">
          <img
            alt="User profile"
            className="w-full h-full object-cover grayscale"
            src={PROFILE_IMAGE_URL}
          />
        </div>
        <span className="text-[10px] font-medium uppercase tracking-wider">Me</span>
      </a>
    </nav>
  );
};

export default BottomNav;
