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
  const baseStyles = "font-cinzel font-bold text-sm uppercase tracking-widest py-4 px-8 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden";
  
  const variants = {
    primary: "bg-gradient-to-br from-accent-gold to-accent-gold-dim text-bg-primary shadow-[0_0_20px_rgba(199,168,123,0.3)] hover:shadow-[0_0_35px_rgba(199,168,123,0.5)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0 disabled:shadow-none",
    secondary: "bg-transparent border border-accent-gold/30 text-accent-gold hover:bg-accent-gold/10 disabled:opacity-50"
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