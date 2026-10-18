import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toasts: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none select-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto p-3 rounded-lg border border-zinc-800 bg-zinc-900/95 shadow-xl flex items-center justify-between text-xs backdrop-blur-md transition-all text-zinc-200"
        >
          <div className="flex items-center gap-2.5">
            {t.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : t.type === 'warning' ? (
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-zinc-400 shrink-0" />
            )}
            <span className="font-medium">{t.message}</span>
          </div>

          <button
            onClick={() => removeToast(t.id)}
            className="text-zinc-500 hover:text-white p-1 transition"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
