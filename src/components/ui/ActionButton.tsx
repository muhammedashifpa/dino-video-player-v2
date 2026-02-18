import React from 'react';

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  label?: string; // Optional label for buttons with text
  isActive?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({ 
  icon, 
  label, 
  isActive = false, 
  className = '',
  children,
  ...props 
}) => {
  return (
    <div className={`flex shrink-0 items-center justify-center gap-2 rounded-full bg-black/5 dark:bg-white/5 px-4 py-2 ${className}`}>
        {children ? (
             <button className="flex items-center gap-1.5" {...props}>
                <span className={`material-symbols-outlined text-lg ${isActive ? 'text-primary' : ''}`}>
                    {icon}
                </span>
                {children}
            </button>
        ) : (
             <button className="flex items-center gap-2" {...props}>
                <span className={`material-symbols-outlined text-lg ${isActive ? 'text-primary' : ''}`}>
                    {icon}
                </span>
                {label && <span className="text-xs">{label}</span>}
            </button>
        )}
     
    </div>
  );
};

export default ActionButton;
