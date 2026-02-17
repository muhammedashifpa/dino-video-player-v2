import React from 'react';

const BottomNav: React.FC = () => {
  return (
    <nav className="bg-background-light dark:bg-surface-dark/95 backdrop-blur-md border-t border-border-dark/40 px-6 pt-2 pb-6 flex justify-between items-center sticky bottom-0 z-40">
      <a className="flex flex-col items-center gap-1 text-primary cursor-pointer hover:bg-white/5 p-1 rounded-lg transition-colors" href="#">
        <span className="material-symbols-outlined filled-icon">home</span>
        <span className="text-[10px] font-bold uppercase tracking-wider">Home</span>
      </a>
      <a className="flex flex-col items-center gap-1 text-slate-500 dark:text-slate-400 cursor-pointer hover:text-primary hover:bg-white/5 p-1 rounded-lg transition-colors" href="#">
        <span className="material-symbols-outlined">explore</span>
        <span className="text-[10px] font-medium uppercase tracking-wider">Explore</span>
      </a>
      <a className="flex flex-col items-center gap-1 text-slate-500 dark:text-slate-400 cursor-pointer hover:text-primary hover:bg-white/5 p-1 rounded-lg transition-colors" href="#">
        <span className="material-symbols-outlined">subscriptions</span>
        <span className="text-[10px] font-medium uppercase tracking-wider">Subs</span>
      </a>
      <a className="flex flex-col items-center gap-1 text-slate-500 dark:text-slate-400 cursor-pointer hover:text-primary hover:bg-white/5 p-1 rounded-lg transition-colors" href="#">
        <span className="material-symbols-outlined">video_library</span>
        <span className="text-[10px] font-medium uppercase tracking-wider">Library</span>
      </a>
      <a className="flex flex-col items-center gap-1 text-slate-500 dark:text-slate-400 cursor-pointer hover:text-primary hover:bg-white/5 p-1 rounded-lg transition-colors" href="#">
        <div className="w-6 h-6 rounded-full border border-slate-700 overflow-hidden">
          <img
            alt="User profile"
            className="w-full h-full object-cover grayscale"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLmfgZYWj9Q9df0_8AVqCzDbhC_MpjyQSXo_nwBodQJcKaS_j8HBLw6zfoNCZWJ_yVhhcfJ22bgkpBmCgH3jZNG8R-0duu_7zIi8SgYSJoB1WUDWZ1ifazL1Gv-BnOuZODL_IGTLq-ZriJG3ACriEBMM0OzvyLUD_b_aOFNINWjJCL2o3GbpnBDo4c9gseN1FLieHUCW1WTeqevSGvqY_u5u8ePv_IoK6eol0Ae9IEOEe-tCQn2TQ7a51z3NqOoZ-wSZ9F6BLb1noD"
          />
        </div>
        <span className="text-[10px] font-medium uppercase tracking-wider">Me</span>
      </a>
    </nav>
  );
};

export default BottomNav;
