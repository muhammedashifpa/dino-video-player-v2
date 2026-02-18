import React from 'react';

interface ChannelAvatarProps {
  src: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  highlight?: boolean;
}

const ChannelAvatar: React.FC<ChannelAvatarProps> = ({ 
  src, 
  name, 
  size = 'md', 
  highlight = false 
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  };

  if (highlight) {
    return (
      <div className={`${sizeClasses[size]} rounded-full bg-linear-to-tr from-primary to-purple-400 p-[2px]`}>
        <div className="h-full w-full rounded-full bg-white dark:bg-background-dark p-px">
          <img 
            alt={name} 
            className="h-full w-full rounded-full object-cover" 
            src={src}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} rounded-full bg-primary/20 shrink-0 border border-primary/30 overflow-hidden`}>
      <img
        alt={name}
        className="w-full h-full object-cover"
        src={src}
      />
    </div>
  );
};

export default ChannelAvatar;
