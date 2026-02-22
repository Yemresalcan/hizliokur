import React, { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { ChevronLeft, ChevronRight, X, Play, Loader2 } from 'lucide-react';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

interface PdfPageViewerProps {
  pdfFile: File;
  bookTitle: string;
  savedProgress: number; // last saved word index
  pageOffsets?: number[]; // word index per page
  totalWords: number;
  onResume: (wordIndex: number) => void;
  onClose: () => void;
}

export const PdfPageViewer: React.FC<PdfPageViewerProps> = ({
  pdfFile,
  bookTitle,
  savedProgress,
  pageOffsets,
  totalWords,
  onResume,
  onClose,
}) => {
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(() => {
    // Start viewer on the page where user left off
    if (pageOffsets && savedProgress > 0) {
      const idx = pageOffsets.findLastIndex((offset) => offset <= savedProgress);
      return Math.max(1, idx + 1);
    }
    return 1;
  });
  const [isRendering, setIsRendering] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pdfRef = useRef<pdfjsLib.PDFDocumentProxy | null>(null);
  const renderTaskRef = useRef<pdfjsLib.RenderTask | null>(null);

  // Load PDF once
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const arrayBuffer = await pdfFile.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        if (cancelled) return;
        pdfRef.current = pdf;
        setTotalPages(pdf.numPages);
      } catch {
        // ignore
      }
    };
    load();
    return () => { cancelled = true; };
  }, [pdfFile]);

  // Render page whenever currentPage or totalPages changes
  useEffect(() => {
    if (!pdfRef.current || totalPages === 0) return;
    let cancelled = false;

    const render = async () => {
      if (!canvasRef.current || !pdfRef.current) return;
      setIsRendering(true);

      // Cancel any in-flight render
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
        renderTaskRef.current = null;
      }

      try {
        const page = await pdfRef.current.getPage(currentPage);
        if (cancelled) return;

        const canvas = canvasRef.current;
        const container = canvas.parentElement!;
        const containerWidth = container.clientWidth;
        const baseViewport = page.getViewport({ scale: 1 });
        const scale = containerWidth / baseViewport.width;
        const viewport = page.getViewport({ scale });

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const ctx = canvas.getContext('2d')!;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const task = page.render({ canvasContext: ctx, viewport, canvas });
        renderTaskRef.current = task;
        await task.promise;
        if (!cancelled) setIsRendering(false);
      } catch (e: any) {
        if (e?.name !== 'RenderingCancelledException' && !cancelled) {
          setIsRendering(false);
        }
      }
    };

    render();
    return () => { cancelled = true; };
  }, [currentPage, totalPages]);

  const goTo = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(totalPages, page)));
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black flex flex-col animate-fade-in"
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') goTo(currentPage - 1);
        if (e.key === 'ArrowRight') goTo(currentPage + 1);
        if (e.key === 'Escape') onClose();
      }}
      tabIndex={0}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 flex-shrink-0">
        <button
          onClick={onClose}
          className="p-2 text-secondary hover:text-white rounded-full hover:bg-white/10 transition-colors"
        >
          <X size={20} />
        </button>
        <h2 className="text-sm font-medium text-white truncate flex-1">{bookTitle}</h2>
        {totalPages > 0 && (
          <span className="text-xs font-mono text-secondary flex-shrink-0">
            {currentPage} / {totalPages}
          </span>
        )}
      </div>

      {/* Page area */}
      <div className="flex-1 overflow-y-auto flex items-start justify-center p-4 relative">
        {/* Loading overlay */}
        {isRendering && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/50">
            <Loader2 size={32} className="text-accent animate-spin" />
          </div>
        )}

        {/* Canvas container */}
        <div className="w-full max-w-xl relative">
          <canvas
            ref={canvasRef}
            className="w-full rounded-xl shadow-2xl border border-white/5"
          />
        </div>

        {/* Left arrow */}
        <button
          onClick={() => goTo(currentPage - 1)}
          disabled={currentPage <= 1}
          className="fixed left-3 top-1/2 -translate-y-1/2 p-3 bg-black/60 backdrop-blur-sm text-white rounded-full hover:bg-black/80 disabled:opacity-20 transition-all shadow-xl"
        >
          <ChevronLeft size={22} />
        </button>

        {/* Right arrow */}
        <button
          onClick={() => goTo(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="fixed right-3 top-1/2 -translate-y-1/2 p-3 bg-black/60 backdrop-blur-sm text-white rounded-full hover:bg-black/80 disabled:opacity-20 transition-all shadow-xl"
        >
          <ChevronRight size={22} />
        </button>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-4 px-4 py-4 border-t border-white/10 flex-shrink-0">
        {/* Page dots / mini nav */}
        <div className="flex items-center gap-1 overflow-hidden max-w-[160px]">
          {totalPages > 0 &&
            Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              const page = totalPages <= 7 ? i + 1 : Math.round((i / 6) * (totalPages - 1)) + 1;
              const isActive = currentPage === page;
              return (
                <button
                  key={i}
                  onClick={() => goTo(page)}
                  className={`rounded-full transition-all flex-shrink-0 ${isActive ? 'w-4 h-1.5 bg-accent' : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'}`}
                />
              );
            })}
        </div>

        <button
          onClick={() => {
            // Calculate word index for the current page
            let wordIndex = 0;
            if (pageOffsets && pageOffsets.length >= currentPage) {
              wordIndex = pageOffsets[currentPage - 1];
            } else if (totalWords > 0 && totalPages > 0) {
              // Fallback: linear estimate
              wordIndex = Math.round(((currentPage - 1) / totalPages) * totalWords);
            }
            onResume(wordIndex);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent/90 text-white font-bold rounded-full active:scale-95 transition-all shadow-lg"
        >
          <Play size={16} fill="currentColor" />
          {currentPage === 1 && savedProgress === 0 ? 'Okumaya Başla' : `${currentPage}. sayfadan başla`}
        </button>
      </div>
    </div>
  );
};
