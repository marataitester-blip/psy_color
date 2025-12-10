import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
  loadingText?: string;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading = false, 
  loadingText,
  className = '',
  disabled,
  ...props 
}) => {
  const baseStyles = "font-cinzel text-xs uppercase tracking-[0.25em] py-4 px-8 transition-all duration-500 flex items-center justify-center gap-3 relative overflow-hidden group border";
  
  const variants = {
    primary: "border-accent-gold bg-accent-gold/10 text-accent-gold hover:bg-accent-gold hover:text-bg-primary shadow-[0_0_15px_rgba(199,168,123,0.1)] hover:shadow-[0_0_30px_rgba(199,168,123,0.4)] disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-accent-gold",
    secondary: "border-white/10 text-text-secondary hover:border-accent-gold/40 hover:text-accent-gold bg-transparent disabled:opacity-30"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {isLoading ? (loadingText || children) : children}
    </button>
  );
};