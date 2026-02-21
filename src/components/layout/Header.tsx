import React from 'react';



const Header: React.FC = () => {
  return (
    <header className="w-full bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-border-dark/20">
      <div className="max-w-screen-2xl mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-1 rounded-lg flex items-center justify-center">
            <img src="/vite.svg" alt="Dino Player" className="w-6 h-6" />
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
      </div>
    </header>
  );
};


export default Header;
