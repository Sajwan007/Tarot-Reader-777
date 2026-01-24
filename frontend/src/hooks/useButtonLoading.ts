import { useState } from 'react';

export function useButtonLoading(delay = 300) {
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
    setShowLoader(false);
  };

  // Auto-stop loading after timeout (safety)
  const stopLoadingAfter = (ms: number) => {
    const timer = setTimeout(() => {
      stopLoading();
    }, ms);

    return timer;
  };

  return {
    isLoading,
    showLoader,
    startLoading,
    stopLoading,
    stopLoadingAfter
  };
}
