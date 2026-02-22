import React from 'react';
import { Trophy, RotateCcw, Library, Zap } from 'lucide-react';

interface CompletionScreenProps {
  totalWords: number;
  elapsedSeconds: number;
  wpm: number;
  onRestart: () => void;
  onBack: () => void;
}

const fmt = (s: number): string => {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return m > 0 ? `${m}dk ${sec}sn` : `${sec}sn`;
};

export const CompletionScreen: React.FC<CompletionScreenProps> = ({
  totalWords,
  elapsedSeconds,
  wpm,
  onRestart,
  onBack,
}) => {
  const achievedWpm = elapsedSeconds > 0
    ? Math.round((totalWords / elapsedSeconds) * 60)
    : wpm;

  return (
    <div className="absolute inset-0 bg-background flex flex-col items-center justify-center p-8 animate-fade-in z-40">
      {/* Trophy */}
      <div className="w-20 h-20 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mb-6">
        <Trophy size={36} className="text-accent" />
      </div>

      <h2 className="text-3xl font-display font-bold text-white mb-2">Tamamlandı!</h2>
      <p className="text-secondary text-sm mb-10">Harika iş çıkardın.</p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 w-full max-w-xs mb-10">
        <div className="bg-surfaceHighlight border border-white/5 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold font-mono text-white mb-1">{totalWords.toLocaleString()}</div>
          <div className="text-[11px] text-secondary uppercase tracking-widest">Kelime</div>
        </div>
        <div className="bg-surfaceHighlight border border-white/5 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold font-mono text-white mb-1">{fmt(elapsedSeconds)}</div>
          <div className="text-[11px] text-secondary uppercase tracking-widest">Süre</div>
        </div>
        <div className="bg-accent/10 border border-accent/20 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold font-mono text-accent mb-1 flex items-center justify-center gap-1">
            <Zap size={16} className="shrink-0" />{achievedWpm}
          </div>
          <div className="text-[11px] text-secondary uppercase tracking-widest">WPM</div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button
          onClick={onRestart}
          className="w-full py-3.5 bg-white text-black font-bold rounded-2xl hover:bg-gray-100 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg"
        >
          <RotateCcw size={18} />
          Yeniden Oku
        </button>
        <button
          onClick={onBack}
          className="w-full py-3.5 bg-surfaceHighlight text-secondary hover:text-primary font-medium rounded-2xl hover:bg-white/10 active:scale-95 transition-all flex items-center justify-center gap-2 border border-white/5"
        >
          <Library size={18} />
          Kütüphaneye Dön
        </button>
      </div>
    </div>
  );
};
