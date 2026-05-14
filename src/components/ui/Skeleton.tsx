import React from 'react';
import { motion } from 'motion/react';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  variant?: 'rect' | 'circle' | 'text';
}

export default function Skeleton({ 
  className = '', 
  width, 
  height, 
  variant = 'rect' 
}: SkeletonProps) {
  const baseStyles = "relative overflow-hidden bg-brand-ink/5";
  const variantStyles = {
    rect: "rounded-md",
    circle: "rounded-full",
    text: "rounded h-4 mb-2"
  };

  return (
    <div 
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      style={{ width, height }}
    >
      <motion.div
        animate={{
          x: ['-100%', '100%']
        }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "linear"
        }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
      />
    </div>
  );
}
