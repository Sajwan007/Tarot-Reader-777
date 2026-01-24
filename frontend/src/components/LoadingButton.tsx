import React from 'react';
import { Button } from './ui/Button';
import { LottieAnimationLoader } from './LottieAnimationLoader';
import { useButtonLoading } from '../hooks/useButtonLoading';

interface LoadingButtonProps {
  children: React.ReactNode;
  onClick?: () => void | Promise<void>;
  loadingDelay?: number;
  className?: string;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
}

export function LoadingButton({
  children,
  onClick,
  loadingDelay = 300,
  className = '',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false
}: LoadingButtonProps) {
  const { showLoader, startLoading, stopLoading, stopLoadingAfter } = useButtonLoading(loadingDelay);

  const handleClick = async () => {
    if (!onClick || disabled) return;
    
    startLoading();
    const stopTimer = stopLoadingAfter(5000); // Auto-stop after 5 seconds

    try {
      await onClick();
    } catch (error) {
      console.error('Button action failed:', error);
    } finally {
      if (stopTimer) clearTimeout(stopTimer as any);
      stopLoading();
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={disabled || showLoader}
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      className={className}
    >
      {showLoader ? (
        <div className="flex items-center gap-2">
          <LottieAnimationLoader 
            animationPath="/animations/Sandy Loading.json"
            width={16}
            height={16}
          />
          <span className="text-sm">Loading...</span>
        </div>
      ) : (
        children
      )}
    </Button>
  );
}
