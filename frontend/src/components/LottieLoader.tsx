import React, { useEffect, useRef } from 'react';
import lottie from 'lottie-web';

interface LottieLoaderProps {
  animationData: any;
  width?: number;
  height?: number;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
}

export function LottieLoader({ 
  animationData, 
  width = 200, 
  height = 200, 
  loop = true, 
  autoplay = true,
  className = '' 
}: LottieLoaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<any>(null);

  useEffect(() => {
    if (containerRef.current && animationData) {
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

    return () => {
      if (animationRef.current) {
        animationRef.current.destroy();
      }
    };
  }, [animationData, width, height, loop, autoplay]);

  return (
    <div 
      ref={containerRef} 
      className={`flex items-center justify-center ${className}`}
      style={{ width, height }}
    />
  );
}

// Pre-built loading animation data (simple spinner)
export const spinnerAnimation = {
  "v": "5.5.5",
  "fr": 30,
  "ip": 0,
  "op": 60,
  "w": 100,
  "h": 100,
  "nm": "Spinner",
  "ddd": 0,
  "assets": [],
  "layers": [{
    "ddd": 0,
    "ind": 1,
    "ty": 4,
    "nm": "spinner",
    "sr": 1,
    "ks": {
      "o": 2,
      "r": 0,
      "x": 0,
      "y": 0
    },
    "ao": 0,
    "shapes": [{
      "ty": "gr",
      "it": [{
        "ind": 0,
        "ty": "sh",
        "ix": 1,
        "ks": {
          "a": 0,
          "k": [{
            "i": {
              "x": [0.667, 0, 1],
              "y": [0.833, 0, 1]
            },
            "o": {
              "x": [0.167, 0, 1],
              "y": [0.167, 0, 1]
            },
            "t": 0,
            "s": [50, 50]
          }, {
            "i": {
              "x": [0.667, 0, 1],
              "y": [0.833, 0, 1]
            },
            "o": {
              "x": [0.167, 0, 1],
              "y": [0.167, 0, 1]
            },
            "t": 15,
            "s": [50, 50, 0]
          }, {
            "i": {
              "x": [0.667, 0, 1],
              "y": [0.833, 0, 1]
            },
            "o": {
              "x": [0.167, 0, 1],
              "y": [0.167, 0, 1]
            },
            "t": 30,
            "s": [50, 50, 100]
          }],
          "to": {
            "a": 1,
            "k": [{
              "t": 0,
              "s": [0, 0]
            }, {
              "t": 30,
              "s": [360, 360]
            }]
          }
        },
        "o": {
          "a": 0,
          "k": 100
        },
        "r": 1,
        "p": 10,
        "nm": "Path 1",
        "mn": "ADBE Vector Shape",
        "hd": false
      }, {
        "ty": "fl",
        "c": {
          "a": 0,
          "k": [{
            "i": {
              "x": [0.833, 0, 1],
              "y": [0.833, 0, 1]
            },
            "o": {
              "x": [0.167, 0, 1],
              "y": [0.167, 0, 1]
            },
            "t": 0,
            "s": [1, 0.8, 0.8, 1]
          }, {
            "i": {
              "x": [0.833, 0, 1],
              "y": [0.833, 0, 1]
            },
            "o": {
              "x": [0.167, 0, 1],
              "y": [0.167, 0, 1]
            },
            "t": 15,
            "s": [0.8, 0.8, 0.8, 1]
          }, {
            "i": {
              "x": [0.833, 0, 1],
              "y": [0.833, 0, 1]
            },
            "o": {
              "x": [0.167, 0, 1],
              "y": [0.167, 0, 1]
            },
            "t": 30,
            "s": [1, 0.8, 0.8, 1]
          }]
        },
        "o": {
          "a": 0,
          "k": 100
        },
        "r": 1,
        "nm": "Fill 1",
        "mn": "ADBE Vector Graphic - Fill",
        "hd": false
      }]
    }],
    "ip": 0,
    "op": 60,
    "st": 0
  }]
};
