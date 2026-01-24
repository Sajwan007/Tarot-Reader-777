import React, { useEffect, useRef } from 'react';
import lottie from 'lottie-web';

interface LottieAnimationLoaderProps {
  animationPath: string;
  width?: number;
  height?: number;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
}

export function LottieAnimationLoader({ 
  animationPath, 
  width = 200, 
  height = 200, 
  loop = true, 
  autoplay = true,
  className = '' 
}: LottieAnimationLoaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<any>(null);

  useEffect(() => {
    if (containerRef.current) {
      // Load animation from JSON file
      fetch(animationPath)
        .then(response => response.json())
        .then(animationData => {
          if (containerRef.current) {
            animationRef.current = lottie.loadAnimation({
              container: containerRef.current,
              renderer: 'svg',
              loop,
              autoplay,
              animationData,
              width,
              height
            });
          }
        })
        .catch(error => {
          console.error('Error loading Lottie animation:', error);
        });
    }

    return () => {
      if (animationRef.current) {
        animationRef.current.destroy();
      }
    };
  }, [animationPath, width, height, loop, autoplay]);

  return (
    <div 
      ref={containerRef} 
      className={`flex items-center justify-center ${className}`}
      style={{ width, height }}
    />
  );
}
