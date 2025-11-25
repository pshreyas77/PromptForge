
import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  icon, 
  className = '', 
  disabled,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#020617] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";
  
  const variants = {
    primary: `
      bg-gradient-to-r from-brand-600 to-brand-500 
      hover:from-brand-500 hover:to-brand-400 
      text-white 
      shadow-[0_0_20px_-5px_rgba(20,184,166,0.4)] hover:shadow-[0_0_25px_-5px_rgba(20,184,166,0.6)]
      border border-transparent
      py-3 px-6
      focus:ring-brand-500
    `,
    secondary: `
      bg-slate-200/50 dark:bg-gray-800/50 hover:bg-slate-300/50 dark:hover:bg-gray-700/50 
      text-slate-700 dark:text-gray-200 
      border border-slate-300 dark:border-gray-700 
      hover:border-slate-400 dark:hover:border-gray-500
      backdrop-blur-sm
      py-2 px-4
      shadow-lg
      focus:ring-gray-500
    `,
    ghost: `
      bg-transparent hover:bg-slate-200 dark:hover:bg-white/5 
      text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white 
      py-2 px-3
      focus:ring-gray-500
    `
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
      {!isLoading && icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
