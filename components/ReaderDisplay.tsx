import React from 'react';
import { WordData } from '../types';

interface ReaderDisplayProps {
  currentWord: WordData | null;
  darkMode: boolean; // Kept for API compatibility
  isPlaying: boolean;
  fontSize: number; // 1 to 5 scale
}

export const ReaderDisplay: React.FC<ReaderDisplayProps> = ({ currentWord, fontSize }) => {
  
  // Calculate Text Size Class
  const getTextSizeClass = (size: number) => {
    switch (size) {
      case 1: return 'text-4xl sm:text-5xl';
      case 2: return 'text-5xl sm:text-6xl';
      case 3: return 'text-6xl sm:text-7xl'; // Default
      case 4: return 'text-7xl sm:text-8xl';
      case 5: return 'text-8xl sm:text-9xl';
      default: return 'text-6xl sm:text-7xl';
    }
  };

  const textClass = getTextSizeClass(fontSize);

  // Focus guides (subtle lines)
  const guideClass = `w-px h-8 bg-accent/30 absolute left-1/2 -translate-x-1/2`;
  const horizontalGuideClass = `w-32 h-px bg-white/5 absolute left-1/2 -translate-x-1/2`;

  if (!currentWord) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full animate-pulse">
        <span className="text-secondary font-medium text-xl tracking-[0.2em] uppercase">Hazır</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full w-full relative select-none z-10 font-mono">
      {/* Visual Guides */}
      <div className={`${guideClass} -top-12`}></div>
      <div className={`${guideClass} -bottom-12`}></div>
      
      {/* Horizontal guides to frame the word */}
      <div className={`${horizontalGuideClass} -top-8 w-16`}></div>
      <div className={`${horizontalGuideClass} -bottom-8 w-16`}></div>

      <div className={`flex items-baseline ${textClass} font-bold tracking-tight leading-none drop-shadow-2xl`}>
        {/* Left part */}
        <span className="text-right w-full text-primary">{currentWord.left}</span>
        
        {/* Middle pivot - High contrast accent */}
        <span className="text-accent mx-0.5 relative z-20">{currentWord.middle}</span>
        
        {/* Right part */}
        <span className="text-left w-full text-primary">{currentWord.right}</span>
      </div>
    </div>
  );
};