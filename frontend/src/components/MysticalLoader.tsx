import React from 'react';
import { motion } from 'framer-motion';

interface MysticalLoaderProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  className?: string;
}

export function MysticalLoader({ 
  size = 'medium', 
  text = 'Loading...', 
  className = '' 
}: MysticalLoaderProps) {
  const sizeMap = {
    small: { width: 40, height: 40 },
    medium: { width: 60, height: 60 },
    large: { width: 80, height: 80 }
  };

  const { width, height } = sizeMap[size];

  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      {/* Mystical Spinner */}
      <motion.div
        className="relative"
        style={{ width, height }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        {/* Outer ring */}
        <div 
          className="absolute inset-0 rounded-full border-2 border-gold/20"
          style={{ width, height }}
        />
        
        {/* Inner spinning element */}
        <div 
          className="absolute inset-2 rounded-full border-t-2 border-r-2 border-gold"
          style={{ 
            width: width - 16, 
            height: height - 16,
            top: 8,
            left: 8
          }}
        />
        
        {/* Center glow */}
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-gold rounded-full"
          style={{
            boxShadow: '0 0 10px rgba(212, 175, 55, 0.8)'
          }}
        />
      </motion.div>

      {/* Loading text */}
      {text && (
        <motion.p
          className="text-white/70 text-sm font-cinzel"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}

// Tarot Card Loader
export function TarotCardLoader() {
  return (
    <div className="relative w-16 h-24">
      {/* Card stack animation */}
      <motion.div
        className="absolute inset-0"
        animate={{
          y: [0, -8, 0],
          rotateZ: [0, 5, -5, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="w-full h-full bg-gradient-to-br from-gold/20 to-gold/10 border border-gold/30 rounded-lg shadow-lg" />
      </motion.div>
      
      <motion.div
        className="absolute inset-0"
        animate={{
          y: [0, -8, 0],
          rotateZ: [0, -5, 5, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      >
        <div className="w-full h-full bg-gradient-to-br from-purple/20 to-purple/10 border border-purple/30 rounded-lg shadow-lg" />
      </motion.div>
      
      <motion.div
        className="absolute inset-0"
        animate={{
          y: [0, -8, 0],
          rotateZ: [0, 5, -5, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      >
        <div className="w-full h-full bg-gradient-to-br from-blue/20 to-blue/10 border border-blue/30 rounded-lg shadow-lg" />
      </motion.div>
    </div>
  );
}

// Crystal Ball Loader
export function CrystalBallLoader() {
  return (
    <div className="relative w-20 h-20">
      {/* Outer glow */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.3) 0%, transparent 70%)'
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Crystal ball */}
      <motion.div
        className="absolute inset-2 rounded-full bg-gradient-to-br from-gold/10 to-gold/5 border border-gold/20"
        animate={{
          rotate: 360
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        {/* Inner light */}
        <div 
          className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, transparent 60%)'
          }}
        />
      </motion.div>
    </div>
  );
}
