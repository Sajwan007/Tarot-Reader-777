# Lottie Animations Folder

This folder contains Lottie animation JSON files for the Reader777 project.

## How to Add Lottie Files:

### 1. Get Lottie Animation Files
- Download from LottieFiles: https://lottiefiles.com/
- Export from Adobe After Effects with Bodymovin plugin
- Create custom animations using Lottie or Adobe After Effects

### 2. Add Animation Files
Place your `.json` animation files in this folder:
```
public/animations/
├── loading-spinner.json
├── tarot-cards.json
├── crystal-ball.json
└── mystical-orb.json
```

### 3. Use in Components

```tsx
import { LottieAnimationLoader } from '../components/LottieAnimationLoader';

function YourComponent() {
  return (
    <LottieAnimationLoader 
      animationPath="/animations/loading-spinner.json"
      width={100}
      height={100}
    />
  );
}
```

### Recommended Animations for Tarot Reader:

1. **Loading Spinner** - For page loading states
2. **Tarot Cards** - For mystical card effects
3. **Crystal Ball** - For spiritual/mystical loading
4. **Mystical Orb** - For magical effects
5. **Success Animation** - For completed actions

### File Naming Convention:
- Use kebab-case: `loading-spinner.json`
- Be descriptive: `tarot-card-flip.json`
- Keep files small: < 50KB for better performance

### Performance Tips:
- Optimize animations before exporting
- Use simple shapes for better performance
- Compress JSON files
- Use appropriate frame rates (24-30fps)
