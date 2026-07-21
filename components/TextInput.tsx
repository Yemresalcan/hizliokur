import React, { useState, useEffect, useRef, useMemo } from 'react';
import { generatePracticeText } from '../services/openRouterService';
import { showToast } from '../utils/toast';
import { Sparkles, Play, Clipboard, Trash2, Loader2, FileText, Upload, Clock, X, BookOpen, Shuffle, FlaskConical, Landmark, Orbit, Brain, Leaf, Lightbulb, Sword, Flame, Palette, ChevronDown } from 'lucide-react';
import { extractTextFromPdf, generatePdfThumbnail } from '../utils/pdfUtils';
import { saveBook, getBooks, deleteBook } from '../services/storageService';
import { savePdf, getPdf, deletePdf } from '../services/indexedDbService';
import { PdfPageViewer } from './PdfPageViewer';
import { Book } from '../types';
import { useI18n } from '../i18n/I18nContext';
import { TranslationKey } from '../i18n/translations';

const AI_CATEGORY_META = [
  { id: 'surprise', icon: Shuffle, color: '#f472b6', labelKey: 'ai.surprise', promptKey: 'ai.prompt.surprise' },
  { id: 'science', icon: FlaskConical, color: '#60a5fa', labelKey: 'ai.science', promptKey: 'ai.prompt.science' },
  { id: 'history', icon: Landmark, color: '#fbbf24', labelKey: 'ai.history', promptKey: 'ai.prompt.history' },
  { id: 'space', icon: Orbit, color: '#a78bfa', labelKey: 'ai.space', promptKey: 'ai.prompt.space' },
  { id: 'psychology', icon: Brain, color: '#34d399', labelKey: 'ai.psychology', promptKey: 'ai.prompt.psychology' },
  { id: 'nature', icon: Leaf, color: '#4ade80', labelKey: 'ai.nature', promptKey: 'ai.prompt.nature' },
  { id: 'philosophy', icon: Lightbulb, color: '#fb923c', labelKey: 'ai.philosophy', promptKey: 'ai.prompt.philosophy' },
  { id: 'mythology', icon: Sword, color: '#f87171', labelKey: 'ai.mythology', promptKey: 'ai.prompt.mythology' },
  { id: 'motivation', icon: Flame, color: '#fbbf24', labelKey: 'ai.motivation', promptKey: 'ai.prompt.motivation' },
  { id: 'art', icon: Palette, color: '#e879f9', labelKey: 'ai.art', promptKey: 'ai.prompt.art' },
] as const satisfies ReadonlyArray<{
  id: string;
  icon: typeof Shuffle;
  color: string;
  labelKey: TranslationKey;
  promptKey: TranslationKey;
}>;

interface TextInputProps {
  onStartReading: (text: string, bookId?: string, initialIndex?: number) => void;
}

export const TextInput: React.FC<TextInputProps> = ({ onStartReading }) => {
  const { t, locale } = useI18n();
  const [text, setText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [recentBooks, setRecentBooks] = useState<Book[]>([]);
  const [activeTab, setActiveTab] = useState<'write' | 'upload'>('write');
  const [viewerBook, setViewerBook] = useState<Book | null>(null);
  const [viewerPdfFile, setViewerPdfFile] = useState<File | null>(null);
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [generatingCategory, setGeneratingCategory] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = useMemo(
    () =>
      AI_CATEGORY_META.map((cat) => ({
        ...cat,
        label: t(cat.labelKey),
        prompt: t(cat.promptKey),
      })),
    [t]
  );

  useEffect(() => {
    loadRecentBooks();
  }, []);

  const loadRecentBooks = () => {
    setRecentBooks(getBooks());
  };

  const handleGenerate = async (topic: string = '', categoryId: string = '') => {
    setIsGenerating(true);
    setGeneratingCategory(categoryId);
    try {
      const result = await generatePracticeText(topic, locale);
      setText(result);
      setShowAiPanel(false);
    } catch (e) {
      showToast(e instanceof Error ? e.message : t('text.errGenerate'), 'error');
    } finally {
      setIsGenerating(false);
      setGeneratingCategory(null);
    }
  };

  const handleStart = () => {
    if (!text.trim()) return;
    onStartReading(text);
  };

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText(clipboardText);
    } catch {
      // Fallback
    }
  };

  const handleClear = () => {
    setText('');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      showToast(t('text.errInvalidPdf'), 'error');
      return;
    }

    setIsUploading(true);
    try {
      const [{ text: extractedText, pageOffsets }, thumbnail] = await Promise.all([
        extractTextFromPdf(file),
        generatePdfThumbnail(file),
      ]);
      if (!extractedText.trim()) {
        throw new Error(t('text.errEmptyPdf'));
      }

      const newBook: Book = {
        id: crypto.randomUUID(),
        title: file.name.replace('.pdf', ''),
        text: extractedText,
        totalWords: extractedText.split(/\s+/).length,
        progress: 0,
        lastRead: Date.now(),
        wpm: 300,
        thumbnail,
        pageOffsets,
      };

      saveBook(newBook);
      await savePdf(newBook.id, file);
      loadRecentBooks();

      setViewerBook(newBook);
      setViewerPdfFile(file);
    } catch (error) {
      console.error(error);
      showToast(t('text.errPdfUpload'), 'error');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleResumeBook = async (book: Book) => {
    if (book.thumbnail) {
      try {
        const file = await getPdf(book.id);
        if (file) {
          setViewerBook(book);
          setViewerPdfFile(file);
          return;
        }
      } catch {
        // IndexedDB error — fall through to text-only reading
      }
    }
    onStartReading(book.text, book.id, book.progress);
  };

  const handleDeleteBook = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteBook(id);
    await deletePdf(id);
    loadRecentBooks();
  };

  return (
    <div className="flex flex-col gap-8 pb-20">
      {viewerBook && viewerPdfFile && (
        <PdfPageViewer
          pdfFile={viewerPdfFile}
          bookTitle={viewerBook.title}
          savedProgress={viewerBook.progress}
          pageOffsets={viewerBook.pageOffsets}
          totalWords={viewerBook.totalWords}
          onResume={(wordIndex) => {
            const book = viewerBook;
            setViewerBook(null);
            setViewerPdfFile(null);
            onStartReading(book.text, book.id, wordIndex);
          }}
          onClose={() => {
            setViewerBook(null);
            setViewerPdfFile(null);
          }}
        />
      )}

      {recentBooks.length > 0 && (
        <section className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-lg font-display font-semibold text-white">{t('text.recent')}</h2>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {recentBooks.map((book) => {
              const progressPct =
                book.totalWords > 0
                  ? Math.round((book.progress / book.totalWords) * 100)
                  : 0;
              const wordsLeft = book.totalWords - book.progress;
              const minsLeft = Math.ceil(wordsLeft / (book.wpm || 300));
              return (
                <div
                  key={book.id}
                  onClick={() => handleResumeBook(book)}
                  className="relative rounded-xl cursor-pointer group overflow-hidden border border-white/8 hover:border-white/20 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                  style={{ aspectRatio: '2/3' }}
                >
                  {book.thumbnail ? (
                    <img
                      src={book.thumbnail}
                      alt={book.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-surfaceHighlight flex items-center justify-center">
                      <FileText size={36} className="text-secondary/40" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />

                  <button
                    onClick={(e) => handleDeleteBook(e, book.id)}
                    className="absolute top-2 right-2 p-1.5 bg-black/50 backdrop-blur-sm text-white/60 hover:text-red-400 hover:bg-black/70 rounded-full transition-colors opacity-0 group-hover:opacity-100 z-10"
                  >
                    <X size={12} />
                  </button>

                  <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
                    <h3 className="text-xs font-semibold text-white leading-tight line-clamp-2 mb-2">
                      {book.title}
                    </h3>

                    <div className="h-0.5 w-full bg-white/20 rounded-full mb-1.5 overflow-hidden">
                      <div
                        className="h-full bg-accent transition-all"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-white/50">{progressPct}%</span>
                      {wordsLeft > 0 && (
                        <span className="text-[10px] text-white/50 flex items-center gap-0.5">
                          <Clock size={9} /> {t('text.minsLeft', { n: minsLeft })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="text-lg font-display font-semibold text-white">{t('text.newReading')}</h2>
        </div>

        <div className="bg-surfaceHighlight border border-white/5 rounded-3xl p-1 overflow-hidden shadow-2xl">
          <div className="flex p-1 gap-1 mb-1">
            <button
              onClick={() => setActiveTab('write')}
              className={`flex-1 py-2.5 text-sm font-medium rounded-2xl transition-all flex items-center justify-center gap-2 ${activeTab === 'write' ? 'bg-white/10 text-white shadow-sm' : 'text-secondary hover:text-white hover:bg-white/5'}`}
            >
              <BookOpen size={16} />
              {t('text.tabText')}
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex-1 py-2.5 text-sm font-medium rounded-2xl transition-all flex items-center justify-center gap-2 ${activeTab === 'upload' ? 'bg-white/10 text-white shadow-sm' : 'text-secondary hover:text-white hover:bg-white/5'}`}
            >
              <Upload size={16} />
              {t('text.tabPdf')}
            </button>
          </div>

          <div className="p-4 bg-background/50 rounded-2xl min-h-[240px] relative">
            {activeTab === 'write' ? (
              <div className="h-full flex flex-col">
                <textarea
                  className="w-full flex-1 bg-transparent text-primary placeholder-secondary/30 resize-none outline-none font-mono text-sm leading-relaxed min-h-[180px]"
                  placeholder={t('text.placeholder')}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />

                {showAiPanel && (
                  <div className="mb-3 mt-1 animate-fade-in">
                    <p
                      className="text-xs text-secondary mb-2.5 font-medium"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      {t('text.aiPrompt')}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat) => {
                        const Icon = cat.icon;
                        const isLoading = generatingCategory === cat.id;
                        return (
                          <button
                            key={cat.id}
                            onClick={() => handleGenerate(cat.prompt, cat.id)}
                            disabled={isGenerating}
                            className="flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-semibold transition-all hover:scale-105 active:scale-95 disabled:opacity-40"
                            style={{
                              fontFamily: "'Plus Jakarta Sans', sans-serif",
                              background: `${cat.color}18`,
                              color: cat.color,
                              border: `1px solid ${cat.color}30`,
                            }}
                          >
                            {isLoading ? (
                              <Loader2 size={13} className="animate-spin" />
                            ) : (
                              <Icon size={13} />
                            )}
                            {cat.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-2">
                  <div className="flex gap-2">
                    <button
                      onClick={handlePaste}
                      className="p-2 text-secondary hover:text-white bg-white/5 rounded-xl transition-colors"
                      title={t('text.paste')}
                    >
                      <Clipboard size={18} />
                    </button>
                    <button
                      onClick={() => setShowAiPanel(!showAiPanel)}
                      disabled={isGenerating}
                      className={`p-2 rounded-xl transition-all disabled:opacity-50 flex items-center gap-1.5 ${showAiPanel ? 'bg-gradient-to-r from-[#06b6d4] via-[#3b82f6] to-[#8b5cf6] text-white shadow-lg shadow-purple-500/25' : 'text-purple-400 hover:text-pink-400 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 hover:from-cyan-500/20 hover:to-purple-500/20'}`}
                      title={t('text.aiGenerate')}
                    >
                      {isGenerating ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Sparkles size={18} />
                      )}
                      <ChevronDown
                        size={14}
                        className={`transition-transform ${showAiPanel ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {text && (
                      <button
                        onClick={handleClear}
                        className="p-2 text-secondary hover:text-red-400 bg-white/5 rounded-xl transition-colors"
                        title={t('text.clear')}
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>

                  <button
                    onClick={handleStart}
                    disabled={!text.trim()}
                    className="py-2 px-6 bg-white text-black hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold text-sm shadow-lg active:scale-95 transition-all flex items-center gap-2"
                  >
                    <Play size={16} fill="currentColor" />
                    {t('text.start')}
                  </button>
                </div>
              </div>
            ) : (
              <div
                className="h-full flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-white/10 rounded-xl hover:border-white/20 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  accept=".pdf"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="w-16 h-16 rounded-full bg-surfaceHighlight flex items-center justify-center mb-4 shadow-inner">
                  {isUploading ? (
                    <Loader2 size={32} className="text-accent animate-spin" />
                  ) : (
                    <Upload size={32} className="text-secondary" />
                  )}
                </div>
                <h3 className="text-white font-medium mb-1">{t('text.uploadPdf')}</h3>
                <p className="text-secondary text-xs max-w-[200px]">{t('text.uploadHint')}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
