import React, { useState, useEffect, useRef } from 'react';
import { generatePracticeText } from '../services/geminiService';
import { showToast } from '../utils/toast';
import { Sparkles, Play, Clipboard, Trash2, Loader2, FileText, Upload, Clock, X, BookOpen, Shuffle, FlaskConical, Landmark, Orbit, Brain, Leaf, Lightbulb, Sword, Flame, Palette, ChevronDown } from 'lucide-react';
import { extractTextFromPdf, generatePdfThumbnail } from '../utils/pdfUtils';
import { saveBook, getBooks, deleteBook } from '../services/storageService';
import { savePdf, getPdf, deletePdf } from '../services/indexedDbService';
import { PdfPageViewer } from './PdfPageViewer';
import { Book } from '../types';

const AI_CATEGORIES = [
  { id: 'surprise', label: 'Beni Şaşırt', icon: Shuffle, color: '#f472b6', prompt: 'Çok az kişinin bildiği, şaşırtıcı ve ilginç bir bilgi veya olay' },
  { id: 'science', label: 'Bilim & Teknoloji', icon: FlaskConical, color: '#60a5fa', prompt: 'Bilim ve teknoloji dünyasından ilginç bir konu, keşif veya buluş' },
  { id: 'history', label: 'Tarih', icon: Landmark, color: '#fbbf24', prompt: 'Tarihten ilginç bir olay, kişi veya dönem hakkında bilgilendirici bir yazı' },
  { id: 'space', label: 'Uzay & Evren', icon: Orbit, color: '#a78bfa', prompt: 'Uzay, evren, gezegenler, yıldızlar veya kozmoloji hakkında büyüleyici bir konu' },
  { id: 'psychology', label: 'Psikoloji', icon: Brain, color: '#34d399', prompt: 'İnsan psikolojisi, davranış kalıpları veya zihin hakkında ilginç bir konu' },
  { id: 'nature', label: 'Doğa & Hayvanlar', icon: Leaf, color: '#4ade80', prompt: 'Doğa, hayvanlar dünyası veya ekosistemler hakkında şaşırtıcı bilgiler' },
  { id: 'philosophy', label: 'Felsefe', icon: Lightbulb, color: '#fb923c', prompt: 'Felsefe, düşünce akımları veya ünlü filozofların fikirleri hakkında bir yazı' },
  { id: 'mythology', label: 'Mitoloji', icon: Sword, color: '#f87171', prompt: 'Yunan, Türk, Mısır veya dünya mitolojisinden ilginç bir hikaye veya efsane' },
  { id: 'motivation', label: 'Motivasyon', icon: Flame, color: '#fbbf24', prompt: 'İlham verici, motive edici bir başarı hikayesi veya hayat dersi' },
  { id: 'art', label: 'Sanat & Edebiyat', icon: Palette, color: '#e879f9', prompt: 'Sanat, edebiyat, müzik veya sinema dünyasından ilginç bir konu veya eser' },
] as const;

interface TextInputProps {
  onStartReading: (text: string, bookId?: string, initialIndex?: number) => void;
}

export const TextInput: React.FC<TextInputProps> = ({ onStartReading }) => {
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
      const result = await generatePracticeText(topic);
      setText(result);
      setShowAiPanel(false);
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Metin oluşturulurken hata oluştu.', 'error');
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
    } catch (e) {
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
      showToast('Lütfen geçerli bir PDF dosyası seçin.', 'error');
      return;
    }

    setIsUploading(true);
    try {
      const [{ text: extractedText, pageOffsets }, thumbnail] = await Promise.all([
        extractTextFromPdf(file),
        generatePdfThumbnail(file),
      ]);
      if (!extractedText.trim()) {
        throw new Error('PDF içeriği boş veya okunamadı.');
      }

      // Create a book entry
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

      // Open viewer instead of auto-starting
      setViewerBook(newBook);
      setViewerPdfFile(file);

    } catch (error) {
      console.error(error);
      showToast('PDF yüklenirken bir hata oluştu. Lütfen metin içeren bir PDF olduğundan emin olun.', 'error');
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
    // Text book or PDF not in IndexedDB - start reading directly
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
      {/* PDF Page Viewer Modal */}
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
      
      {/* Recent Books Section */}
      {recentBooks.length > 0 && (
        <section className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-lg font-display font-semibold text-white">Son Okunanlar</h2>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {recentBooks.map(book => {
              const progressPct = book.totalWords > 0 ? Math.round((book.progress / book.totalWords) * 100) : 0;
              const wordsLeft = book.totalWords - book.progress;
              const minsLeft = Math.ceil(wordsLeft / (book.wpm || 300));
              return (
                <div
                  key={book.id}
                  onClick={() => handleResumeBook(book)}
                  className="relative rounded-xl cursor-pointer group overflow-hidden border border-white/8 hover:border-white/20 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                  style={{ aspectRatio: '2/3' }}
                >
                  {/* Thumbnail or placeholder */}
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

                  {/* Dark gradient overlay at bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />

                  {/* Delete button */}
                  <button
                    onClick={(e) => handleDeleteBook(e, book.id)}
                    className="absolute top-2 right-2 p-1.5 bg-black/50 backdrop-blur-sm text-white/60 hover:text-red-400 hover:bg-black/70 rounded-full transition-colors opacity-0 group-hover:opacity-100 z-10"
                  >
                    <X size={12} />
                  </button>

                  {/* Bottom info */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
                    <h3 className="text-xs font-semibold text-white leading-tight line-clamp-2 mb-2">{book.title}</h3>

                    {/* Progress bar */}
                    <div className="h-0.5 w-full bg-white/20 rounded-full mb-1.5 overflow-hidden">
                      <div className="h-full bg-accent transition-all" style={{ width: `${progressPct}%` }} />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-white/50">{progressPct}%</span>
                      {wordsLeft > 0 && (
                        <span className="text-[10px] text-white/50 flex items-center gap-0.5">
                          <Clock size={9} /> {minsLeft}dk
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

      {/* New Reading Section */}
      <section className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="text-lg font-display font-semibold text-white">Yeni Okuma</h2>
        </div>

        <div className="bg-surfaceHighlight border border-white/5 rounded-3xl p-1 overflow-hidden shadow-2xl">
          {/* Tabs */}
          <div className="flex p-1 gap-1 mb-1">
            <button 
              onClick={() => setActiveTab('write')}
              className={`flex-1 py-2.5 text-sm font-medium rounded-2xl transition-all flex items-center justify-center gap-2 ${activeTab === 'write' ? 'bg-white/10 text-white shadow-sm' : 'text-secondary hover:text-white hover:bg-white/5'}`}
            >
              <BookOpen size={16} />
              Metin
            </button>
            <button 
              onClick={() => setActiveTab('upload')}
              className={`flex-1 py-2.5 text-sm font-medium rounded-2xl transition-all flex items-center justify-center gap-2 ${activeTab === 'upload' ? 'bg-white/10 text-white shadow-sm' : 'text-secondary hover:text-white hover:bg-white/5'}`}
            >
              <Upload size={16} />
              PDF
            </button>
          </div>

          {/* Content Area */}
          <div className="p-4 bg-background/50 rounded-2xl min-h-[240px] relative">
            
            {activeTab === 'write' ? (
              <div className="h-full flex flex-col">
                <textarea
                  className="w-full flex-1 bg-transparent text-primary placeholder-secondary/30 resize-none outline-none font-mono text-sm leading-relaxed min-h-[180px]"
                  placeholder="Buraya metin yapıştırın veya AI ile oluşturun..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                
                {/* AI Category Panel */}
                {showAiPanel && (
                  <div className="mb-3 mt-1 animate-fade-in">
                    <p className="text-xs text-secondary mb-2.5 font-medium" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      Ne tür bir metin oluşturalım?
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {AI_CATEGORIES.map(cat => {
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
                            {isLoading ? <Loader2 size={13} className="animate-spin" /> : <Icon size={13} />}
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
                      title="Yapıştır"
                    >
                      <Clipboard size={18} />
                    </button>
                    <button 
                      onClick={() => setShowAiPanel(!showAiPanel)}
                      disabled={isGenerating}
                      className={`p-2 rounded-xl transition-all disabled:opacity-50 flex items-center gap-1.5 ${showAiPanel ? 'bg-accent text-white' : 'text-accent hover:text-accent/80 bg-accent/10'}`}
                      title="AI ile Oluştur"
                    >
                      {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                      <ChevronDown size={14} className={`transition-transform ${showAiPanel ? 'rotate-180' : ''}`} />
                    </button>
                    {text && (
                      <button 
                        onClick={handleClear}
                        className="p-2 text-secondary hover:text-red-400 bg-white/5 rounded-xl transition-colors"
                        title="Temizle"
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
                    Başla
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-white/10 rounded-xl hover:border-white/20 transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <input 
                  type="file" 
                  accept=".pdf" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  className="hidden" 
                />
                <div className="w-16 h-16 rounded-full bg-surfaceHighlight flex items-center justify-center mb-4 shadow-inner">
                  {isUploading ? <Loader2 size={32} className="text-accent animate-spin" /> : <Upload size={32} className="text-secondary" />}
                </div>
                <h3 className="text-white font-medium mb-1">PDF Yükle</h3>
                <p className="text-secondary text-xs max-w-[200px]">Cihazınızdan bir PDF dosyası seçin ve okumaya başlayın.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};