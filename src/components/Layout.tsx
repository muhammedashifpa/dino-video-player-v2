import React, { type ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="relative flex min-h-screen w-full flex-col mx-auto bg-background-light dark:bg-background-dark shadow-2xl">
      {children}
      
    </div>
  );
};

export default Layout;
