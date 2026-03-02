import React, { useState, useEffect, useRef } from 'react';
import { AppState, WordData } from './types';
import { processTextToWords, calculateDelay } from './utils/rsvpUtils';
import { ReaderDisplay } from './components/ReaderDisplay';
import { Controls } from './components/Controls';
import { TextInput } from './components/TextInput';
import { CompletionScreen } from './components/CompletionScreen';
import { ToastContainer } from './components/Toast';
import { Onboarding, useOnboarding } from './components/Onboarding';
import { updateProgress } from './services/storageService';
import { STORAGE, ORP_ARTIFACT_SCAN_LIMIT, WPM } from './constants';
import { showToast } from './utils/toast';

const LS_WPM = 'hizliokur_wpm';
const LS_FONT = 'hizliokur_fontSize';

const App: React.FC = () => {
  const { show: showOnboarding, done: doneOnboarding, reopen: reopenOnboarding } = useOnboarding();

  // Application State
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [words, setWords] = useState<WordData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Persisted settings — read from localStorage on first render
  const [wpm, setWpmState] = useState<number>(() => {
    const saved = Number(localStorage.getItem(LS_WPM));
    return saved >= WPM.min && saved <= WPM.max ? saved : WPM.default;
  });
  const [fontSize, setFontSizeState] = useState<number>(() => {
    const saved = Number(localStorage.getItem(LS_FONT));
    return saved >= 1 && saved <= 5 ? saved : 3;
  });

  const [currentBookId, setCurrentBookId] = useState<string | undefined>(undefined);


  // Reading time tracking (pause-aware)
  const readingStartRef = useRef<number>(0);
  const elapsedRef = useRef<number>(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Refs for timing
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Persist settings on change
  const setWpm = (val: number) => {
    setWpmState(val);
    localStorage.setItem(LS_WPM, String(val));
  };
  const setFontSize = (val: number) => {
    setFontSizeState(val);
    localStorage.setItem(LS_FONT, String(val));
  };

  // Track elapsed reading time, pause when not READING
  useEffect(() => {
    if (appState === AppState.READING) {
      readingStartRef.current = Date.now() - elapsedRef.current * 1000;
      const interval = setInterval(() => {
        elapsedRef.current = (Date.now() - readingStartRef.current) / 1000;
      }, 500);
      return () => clearInterval(interval);
    } else if (appState === AppState.COMPLETED) {
      setElapsedSeconds(Math.round(elapsedRef.current));
    }
  }, [appState]);

  // Save progress effect (debounced)
  useEffect(() => {
    if (currentBookId && currentIndex > 0) {
      const timeout = setTimeout(() => {
        updateProgress(currentBookId, currentIndex);
      }, STORAGE.progressDebounceMs);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, currentBookId]);

  // Main reading loop
  useEffect(() => {
    if (appState !== AppState.READING) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    if (currentIndex < words.length) {
      const currentWord = words[currentIndex];
      const delay = calculateDelay(wpm, currentWord.delayMultiplier);
      timerRef.current = setTimeout(() => {
        if (currentIndex < words.length - 1) {
          setCurrentIndex((prev: number) => prev + 1);
        } else {
          setAppState(AppState.COMPLETED);
        }
      }, delay);
      return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }
  }, [appState, currentIndex, words, wpm]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (appState === AppState.IDLE) return;
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      switch (e.key) {
        case ' ':
          e.preventDefault();
          handleTogglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handleSkip(-10);
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleSkip(10);
          break;
        case 'Escape':
          handleBack();
          break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  // Handlers are stable enough; deps listed to avoid closure issues
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appState, currentIndex, words]);

  // ── Event Handlers ─────────────────────────────────────────────────────────

  const handleStartReading = (text: string, bookId?: string, initialIndex: number = 0) => {
    const processedWords = processTextToWords(text);
    setWords(processedWords);

    // Skip PDF artifacts at page boundaries
    let adjustedIndex = initialIndex;
    if (initialIndex > 0 && initialIndex < processedWords.length) {
      const limit = Math.min(initialIndex + ORP_ARTIFACT_SCAN_LIMIT, processedWords.length);
      while (adjustedIndex < limit) {
        const w = processedWords[adjustedIndex]?.original ?? '';
        if (/[a-zA-ZğüşöçıİĞÜŞÖÇ\u00C0-\u024F]/.test(w)) break;
        adjustedIndex++;
      }
      if (adjustedIndex >= limit) adjustedIndex = initialIndex;
    }

    setCurrentIndex(adjustedIndex);
    setCurrentBookId(bookId);
    elapsedRef.current = 0;
    setElapsedSeconds(0);
    setAppState(AppState.READING);
  };

  const handleTogglePlay = () => {
    if (appState === AppState.READING) {
      setAppState(AppState.PAUSED);
      if (currentBookId) updateProgress(currentBookId, currentIndex);
    } else if (appState === AppState.PAUSED || appState === AppState.COMPLETED) {
      if (currentIndex >= words.length - 1) setCurrentIndex(0);
      setAppState(AppState.READING);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    elapsedRef.current = 0;
    setElapsedSeconds(0);
    setAppState(AppState.PAUSED);
  };

  const handleBack = () => {
    if (currentBookId) updateProgress(currentBookId, currentIndex);
    setAppState(AppState.IDLE);
    setCurrentIndex(0);
    setWords([]);
    setCurrentBookId(undefined);
    elapsedRef.current = 0;
    setElapsedSeconds(0);
  };

  const handleSkip = (amount: number) => {
    const newIndex = Math.max(0, Math.min(words.length - 1, currentIndex + amount));
    setCurrentIndex(newIndex);
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="h-[100dvh] w-full flex flex-col relative bg-background text-primary overflow-hidden font-sans selection:bg-accent selection:text-white">
      <ToastContainer />
      {showOnboarding && <Onboarding onDone={doneOnboarding} />}

      <main className="flex-1 flex flex-col w-full h-full relative z-10">
        {appState === AppState.IDLE ? (
          <div className="flex-1 flex flex-col animate-fade-in p-6 sm:p-8 overflow-y-auto">
            <div className="mt-4 mb-8 flex items-center justify-between">
              <button
                onClick={reopenOnboarding}
                className="text-left group"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                <h1 className="text-3xl font-display font-bold tracking-tight text-white mb-1 group-active:opacity-70 transition-opacity">HızlıOkur</h1>
                <p className="text-secondary text-sm font-medium group-active:opacity-70 transition-opacity">Kütüphanen</p>
              </button>
              <div className="w-10 h-10 rounded-full bg-surfaceHighlight border border-white/10 flex items-center justify-center relative overflow-hidden shadow-[0_0_15px_rgba(139,92,246,0.15)]">
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-blue-500/10 to-purple-500/10" />
                <span className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 z-10">AI</span>
              </div>
            </div>
            <div className="flex-1 w-full max-w-2xl mx-auto">
              <TextInput onStartReading={handleStartReading} />
            </div>
            {/* Creator credit */}
            <div className="mt-8 pb-2 flex justify-center">
              <a
                href="https://www.yunusemresalcan.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-secondary/40 hover:text-secondary transition-colors"
              >
                yunus emre salcan tarafından yapıldı
              </a>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col absolute inset-0 animate-fade-in bg-background">
            {/* Completion overlay */}
            {appState === AppState.COMPLETED && (
              <CompletionScreen
                totalWords={currentIndex + 1}
                elapsedSeconds={elapsedSeconds}
                wpm={wpm}
                onRestart={handleReset}
                onBack={handleBack}
              />
            )}

            {/* Word display */}
            <div className="flex-1 flex items-center justify-center p-4 pb-32">
              <ReaderDisplay
                currentWord={words[currentIndex]}
                darkMode={true}
                isPlaying={appState === AppState.READING}
                fontSize={fontSize}
              />
            </div>

            {/* Controls */}
            <div className="absolute bottom-0 left-0 w-full pb-safe z-50">
              <Controls
                isPlaying={appState === AppState.READING}
                onTogglePlay={handleTogglePlay}
                onReset={handleReset}
                onBack={handleBack}
                wpm={wpm}
                onWpmChange={setWpm}
                progress={words.length > 0 ? (currentIndex / words.length) * 100 : 0}
                totalWords={words.length}
                currentWordIndex={currentIndex}
                fontSize={fontSize}
                onFontSizeChange={setFontSize}
                onSkip={handleSkip}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
