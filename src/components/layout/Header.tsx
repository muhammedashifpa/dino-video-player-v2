import React from 'react';



const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-border-dark/20">
      <div className="flex items-center gap-2">
        <div className="bg-primary p-1.5 rounded-lg flex items-center justify-center">
          <span className="material-symbols-outlined text-white text-xl filled-icon">
            play_circle
          </span>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white uppercase select-none">
          Dino Player
        </h1>
      </div>
      <div className="flex gap-4">

        <button className="text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <button className="text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">
          <span className="material-symbols-outlined">search</span>
        </button>
      </div>
    </header>
  );
};


export default Header;
