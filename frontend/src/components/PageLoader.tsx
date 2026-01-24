import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LottieAnimationLoader } from './LottieAnimationLoader';

interface PageLoaderProps {
  isLoading: boolean;
  delay?: number; // Delay before showing loader (ms)
  minDisplayTime?: number; // Minimum time to show loader (ms)
}

export function PageLoader({ 
  isLoading, 
  delay = 500, 
  minDisplayTime = 800 
}: PageLoaderProps) {
  const [showLoader, setShowLoader] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    let showTimeout: NodeJS.Timeout;
    let hideTimeout: NodeJS.Timeout;

    if (isLoading) {
      // Show loader after delay
      showTimeout = setTimeout(() => {
        setShowLoader(true);
        setShowContent(true);
      }, delay);
    } else {
      // Hide loader after minimum display time
      if (showLoader) {
        hideTimeout = setTimeout(() => {
          setShowContent(false);
          setTimeout(() => setShowLoader(false), 300); // Allow exit animation
        }, minDisplayTime);
      }
    }

    return () => {
      clearTimeout(showTimeout);
      clearTimeout(hideTimeout);
    };
  }, [isLoading, delay, minDisplayTime, showLoader]);

  return (
    <AnimatePresence>
      {showLoader && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-cosmic-dark/95 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ 
              duration: 0.4,
              ease: "easeOut"
            }}
            className="flex flex-col items-center gap-6 p-8 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10"
          >
            {/* Sandy Animation */}
            <LottieAnimationLoader 
              animationPath="/animations/Sandy Loading.json"
              width={120}
              height={120}
            />
            
            {/* Loading Text */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <h3 className="text-xl font-cinzel font-bold text-white mb-2">
                Loading Mystical Experience
              </h3>
              <motion.p
                className="text-white/60 text-sm"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                Preparing your tarot reading journey...
              </motion.p>
            </motion.div>

            {/* Progress Dots */}
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-gold rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hook for managing page loading state
export function usePageLoader() {
  const [isLoading, setIsLoading] = useState(false);

  const startLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);

  return { isLoading, startLoading, stopLoading };
}
