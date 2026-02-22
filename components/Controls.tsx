import React, { useState } from 'react';
import { Play, Pause, X, Settings, SkipBack, SkipForward, Type, Gauge } from 'lucide-react';

interface ControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  onBack: () => void;
  wpm: number;
  onWpmChange: (val: number) => void;
  progress: number; // 0 to 100
  totalWords: number;
  currentWordIndex: number;
  
  // Font Size props
  fontSize: number;
  onFontSizeChange: (val: number) => void;
  
  // Navigation
  onSkip: (amount: number) => void;
}

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

export const Controls: React.FC<ControlsProps> = ({
  isPlaying,
  onTogglePlay,
  onBack,
  wpm,
  onWpmChange,
  progress,
  totalWords,
  currentWordIndex,
  fontSize,
  onFontSizeChange,
  onSkip
}) => {
  const [showSettings, setShowSettings] = useState(false);

  // Estimate time
  const wordsLeft = totalWords - currentWordIndex;
  const minutesLeft = wordsLeft / wpm;
  const secondsTotal = Math.floor(minutesLeft * 60);
  
  return (
    <div className="w-full max-w-lg mx-auto mb-12 px-6 relative z-50">
      
      {/* Settings Popover */}
      {showSettings && (
        <div className="absolute bottom-full mb-6 left-4 right-4 bg-surface border border-white/10 rounded-2xl p-6 shadow-2xl animate-fade-in-up">
          <div className="space-y-8">
            
            {/* Speed */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm font-medium text-secondary">
                <span className="flex items-center gap-2 uppercase tracking-wider text-xs"><Gauge size={14} /> Hız (WPM)</span>
                <span className="text-primary font-mono">{wpm}</span>
              </div>
              <input
                type="range"
                min="100"
                max="1000"
                step="25"
                value={wpm}
                onChange={(e) => onWpmChange(Number(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent hover:accent-accent/80 transition-all"
              />
            </div>

            {/* Size */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm font-medium text-secondary">
                <span className="flex items-center gap-2 uppercase tracking-wider text-xs"><Type size={14} /> Boyut</span>
                <span className="text-primary font-mono">{fontSize}</span>
              </div>
              <div className="flex justify-between bg-white/5 rounded-xl p-1.5 border border-white/5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    onClick={() => onFontSizeChange(s)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold transition-all ${fontSize === s ? 'bg-white text-black shadow-sm' : 'text-secondary hover:text-primary'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Control Bar */}
      <div className="bg-surface/80 backdrop-blur-xl border border-white/10 rounded-full p-2 shadow-2xl flex items-center justify-between gap-4">
        
        {/* Left Group */}
        <div className="flex items-center gap-1 pl-2">
          <button 
            onClick={onBack}
            className="p-3 text-secondary hover:text-primary hover:bg-white/5 rounded-full transition-all"
            title="Geri Dön"
          >
            <X size={20} />
          </button>
          
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`p-3 rounded-full transition-all ${showSettings ? 'text-primary bg-white/10' : 'text-secondary hover:text-primary hover:bg-white/5'}`}
            title="Ayarlar"
          >
            <Settings size={20} />
          </button>
        </div>

        {/* Center Play Button */}
        <div className="flex items-center gap-4">
           <button 
            onClick={() => onSkip(-10)}
            className="p-2 text-secondary hover:text-primary transition-colors active:scale-90"
          >
            <SkipBack size={20} />
          </button>

          <button 
            onClick={onTogglePlay}
            className="w-16 h-16 bg-primary hover:bg-white text-black rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
          >
            {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
          </button>

          <button 
            onClick={() => onSkip(10)}
            className="p-2 text-secondary hover:text-primary transition-colors active:scale-90"
          >
            <SkipForward size={20} />
          </button>
        </div>

        {/* Right spacer for symmetry */}
        <div className="w-[52px]" />

      </div>

      {/* Progress Bar & Info */}
      <div className="mt-6 px-4">
        <div className="flex justify-between text-xs font-medium text-secondary mb-2 uppercase tracking-widest">
          <span>{currentWordIndex} / {totalWords}</span>
          <span>{formatTime(secondsTotal)} kaldı</span>
        </div>
        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-accent transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

    </div>
  );
};
