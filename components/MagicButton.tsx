
import React from 'react';
import { Loader2 } from 'lucide-react';

interface MagicButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  isLoading?: boolean;
}

export const MagicButton: React.FC<MagicButtonProps> = ({ 
  children, 
  icon, 
  isLoading,
  className = "",
  disabled,
  ...props 
}) => {
  return (
    <button
      className={`relative inline-flex h-12 overflow-hidden rounded-lg p-[1px] focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed group/magic ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {/* Spinning Gradient Border */}
      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#0f766e_0%,#2dd4bf_50%,#0f766e_100%)] opacity-100 transition-opacity" />
      
      {/* Button Content */}
      <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-slate-900 dark:bg-[#020617] px-6 py-1 text-sm font-medium text-brand-100 backdrop-blur-3xl gap-2 transition-colors hover:bg-slate-800 dark:hover:bg-slate-900/80 hover:text-white">
        {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-brand-400" />
        ) : (
            <>
                {icon}
                {children}
            </>
        )}
      </span>
      
      {/* Optional: Subtle inner glow on hover */}
      <div className="absolute inset-0 bg-brand-500/10 opacity-0 group-hover/magic:opacity-100 transition-opacity pointer-events-none rounded-lg" />
    </button>
  );
};
