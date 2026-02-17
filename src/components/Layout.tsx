import React, { type ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="relative flex h-screen w-full flex-col max-w-[430px] mx-auto bg-background-light dark:bg-background-dark shadow-2xl overflow-hidden border-x border-border-dark/30">
      {children}
      
      {/* iOS Home Indicator Area (Visual placeholder) */}
      <div className="absolute bottom-0 w-full z-50 pointer-events-none pb-2 flex justify-center">
         <div className="w-32 h-1 bg-slate-400/20 rounded-full"></div>
      </div>
    </div>
  );
};

export default Layout;
