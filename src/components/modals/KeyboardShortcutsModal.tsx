import React from 'react';
import { useApp } from '../../context/AppContext';
import { Keyboard, X } from 'lucide-react';

export const KeyboardShortcutsModal: React.FC = () => {
  const { isShortcutsOpen, setIsShortcutsOpen, lang } = useApp();

  if (!isShortcutsOpen) return null;

  const SHORTCUTS = [
    { key: '⌘ + K', descEn: 'Open Command Palette', descAr: 'فتح لوحة الأوامر السريعة' },
    { key: '⌘ + /', descEn: 'Show Keyboard Shortcuts', descAr: 'عرض نافذة اختصارات لوحة المفاتيح' },
    { key: '⌘ + B', descEn: 'Switch to Build Studio', descAr: 'الانتقال إلى استوديو البناء' },
    { key: '⌘ + L', descEn: 'Switch to AI Lab', descAr: 'الانتقال إلى مختبر الذكاء الاصطناعي' },
    { key: '⌘ + D', descEn: 'Switch to Deployments', descAr: 'الانتقال إلى لوحة النشر السحابي' },
    { key: 'ESC', descEn: 'Close active modal', descAr: 'إغلاق النوافذ المنبثقة النشطة' },
  ];

  return (
    <div
      onClick={() => setIsShortcutsOpen(false)}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2 text-zinc-100">
            <Keyboard className="w-4 h-4 text-zinc-400" />
            <h3 className="text-sm font-semibold">
              {lang === 'ar' ? 'اختصارات لوحة المفاتيح' : 'Keyboard Shortcuts'}
            </h3>
          </div>
          <button
            onClick={() => setIsShortcutsOpen(false)}
            className="text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-1.5 pt-1">
          {SHORTCUTS.map((s, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-between text-xs"
            >
              <span className="text-zinc-300 font-medium">
                {lang === 'ar' ? s.descAr : s.descEn}
              </span>
              <kbd className="font-mono text-[10px] font-semibold px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
