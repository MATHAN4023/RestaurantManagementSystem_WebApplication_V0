'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline';
  children: React.ReactNode;
}

export function Button({ 
  variant = 'default', 
  children, 
  className = '', 
  ...props 
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-2EFFFF disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    default: "bg-2EFFFF text-black hover:bg-white hover:border hover:border-black",
    outline: "border border-2EFFFF/30 bg-white text-[#222] hover:bg-2EFFFF/20 hover:text-white"
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
} 