import { useState, useEffect } from 'react';

export function usePageTransition(delay = 500, minDisplayTime = 800) {
  const [isLoading, setIsLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  const startLoading = () => {
    setIsLoading(true);
    
    // Show loader after delay
    const showTimer = setTimeout(() => {
      setShowLoader(true);
    }, delay);

    return () => clearTimeout(showTimer);
  };

  const stopLoading = () => {
    setIsLoading(false);
    
    // Keep loader visible for minimum time
    if (showLoader) {
      const hideTimer = setTimeout(() => {
        setShowLoader(false);
      }, minDisplayTime);

      return () => clearTimeout(hideTimer);
    }
  };

  // Auto-stop loading after timeout (safety)
  useEffect(() => {
    if (isLoading) {
      const safetyTimer = setTimeout(() => {
        stopLoading();
      }, 10000); // 10 second max

      return () => clearTimeout(safetyTimer);
    }
  }, [isLoading]);

  return {
    isLoading,
    showLoader,
    startLoading,
    stopLoading
  };
}
