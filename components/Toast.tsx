import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import type { ToastEvent } from '../utils/toast';

interface Toast extends ToastEvent {
  removing: boolean;
}

const DURATION_MS = 4000;
const EXIT_MS = 300;

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<ToastEvent>).detail;
      setToasts(prev => [...prev, { ...detail, removing: false }]);

      setTimeout(() => {
        setToasts(prev =>
          prev.map(t => (t.id === detail.id ? { ...t, removing: true } : t)),
        );
        setTimeout(() => {
          setToasts(prev => prev.filter(t => t.id !== detail.id));
        }, EXIT_MS);
      }, DURATION_MS);
    };

    window.addEventListener('hizliokur:toast', handler);
    return () => window.removeEventListener('hizliokur:toast', handler);
  }, []);

  const dismiss = (id: number) => {
    setToasts(prev => prev.map(t => (t.id === id ? { ...t, removing: true } : t)));
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), EXIT_MS);
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 w-[calc(100vw-2rem)] max-w-sm pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          style={{
            transition: `opacity ${EXIT_MS}ms ease, transform ${EXIT_MS}ms ease`,
            opacity: toast.removing ? 0 : 1,
            transform: toast.removing ? 'translateY(-8px)' : 'translateY(0)',
          }}
          className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-2xl shadow-2xl border backdrop-blur-xl text-sm font-medium ${
            toast.type === 'error'
              ? 'bg-red-950/90 border-red-500/30 text-red-200'
              : toast.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-200'
              : 'bg-surface/90 border-white/10 text-primary'
          }`}
        >
          <span className="mt-0.5 shrink-0">
            {toast.type === 'error' && <XCircle size={16} className="text-red-400" />}
            {toast.type === 'success' && <CheckCircle size={16} className="text-emerald-400" />}
            {toast.type === 'info' && <Info size={16} className="text-accent" />}
          </span>
          <span className="flex-1 leading-snug">{toast.message}</span>
          <button
            onClick={() => dismiss(toast.id)}
            className="mt-0.5 shrink-0 opacity-50 hover:opacity-100 transition-opacity"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};
