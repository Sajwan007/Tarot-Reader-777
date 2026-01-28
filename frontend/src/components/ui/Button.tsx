import React from 'react';
import { motion } from 'framer-motion';
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  fullWidth?: boolean;
}
export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  fullWidth = false,
  ...props
}: ButtonProps) {
  const baseStyles =
  'inline-flex items-center justify-center rounded-full font-cinzel font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold/50 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary:
    'bg-gradient-to-r from-gold to-gold-light text-cosmic-dark hover:shadow-[0_0_20px_rgba(212,175,55,0.5)] hover:scale-105',
    secondary:
    'bg-cosmic-violet/50 backdrop-blur-md border border-gold/30 text-gold hover:bg-cosmic-violet/70 hover:border-gold hover:shadow-[0_0_15px_rgba(212,175,55,0.2)]',
    outline:
    'border-2 border-gold text-gold hover:bg-gold hover:text-cosmic-dark'
  };
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };
  const widthClass = fullWidth ? 'w-full' : '';
  return (
    <motion.button
      whileTap={{
        scale: 0.98
      }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      {...props}>

      {children}
    </motion.button>);

}