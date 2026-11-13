'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'warning' | 'info';

interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
}

interface ToastContextType {
  toast: (title: string, options?: { description?: string; type?: ToastType; durationMs?: number }) => void;
}

const ToastContext = createContext<ToastContextType>({
  toast: () => {},
});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (
      title: string,
      options?: { description?: string; type?: ToastType; durationMs?: number }
    ) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastItem = {
        id,
        title,
        description: options?.description,
        type: options?.type || 'success',
      };

      setToasts((prev) => [...prev, newToast]);

      const duration = options?.durationMs || 4000;
      setTimeout(() => {
        removeToast(id);
      }, duration);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <aside aria-label="Notifications" className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-auto rounded-2xl glass-panel p-4 shadow-xl flex items-start gap-3 border border-emerald-500/20 bg-white/90 dark:bg-emerald-950/90 text-neutral-900 dark:text-neutral-100"
            >
              <div className="mt-0.5 shrink-0">
                {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
                {t.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-500" />}
                {t.type === 'info' && <Info className="w-5 h-5 text-sky-500" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">{t.title}</p>
                {t.description && (
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5 leading-relaxed">
                    {t.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => removeToast(t.id)}
                aria-label="Close notification"
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </aside>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
