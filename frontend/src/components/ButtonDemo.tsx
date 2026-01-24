import React from 'react';
import { LoadingButton } from './LoadingButton';

export function ButtonDemo() {
  const handleLongAction = async () => {
    // Simulate a long-running action
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log('Long action completed!');
  };

  const handleQuickAction = async () => {
    // Simulate a quick action
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Quick action completed!');
  };

  const handleErrorAction = async () => {
    // Simulate an error
    await new Promise((resolve, reject) => 
      setTimeout(() => reject(new Error('Something went wrong!')), 1000)
    );
  };

  return (
    <div className="p-8 space-y-4">
      <h3 className="text-xl font-cinzel text-gold mb-6">Button Loading Demo</h3>
      
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <LoadingButton 
            onClick={handleLongAction}
            loadingDelay={300}
          >
            Long Action (3s)
          </LoadingButton>
          <span className="text-white/60 text-sm">Shows Sandy animation after 300ms</span>
        </div>

        <div className="flex items-center gap-4">
          <LoadingButton 
            onClick={handleQuickAction}
            loadingDelay={300}
            variant="secondary"
          >
            Quick Action (0.5s)
          </LoadingButton>
          <span className="text-white/60 text-sm">Animation might not appear</span>
        </div>

        <div className="flex items-center gap-4">
          <LoadingButton 
            onClick={handleErrorAction}
            loadingDelay={300}
            variant="secondary"
          >
            Error Action (1s)
          </LoadingButton>
          <span className="text-white/60 text-sm">Shows error in console</span>
        </div>
      </div>

      <div className="mt-8 p-4 bg-white/5 rounded-lg">
        <h4 className="text-gold font-cinzel mb-2">How it works:</h4>
        <ul className="text-white/80 space-y-2 text-sm">
          <li>• Click any button → Loading state activates</li>
          <li>• Sandy animation appears after delay</li>
          <li>• Button disabled during loading</li>
          <li>• Auto-stops when action completes</li>
          <li>• 5-second safety timeout prevents infinite loading</li>
        </ul>
      </div>
    </div>
  );
}
