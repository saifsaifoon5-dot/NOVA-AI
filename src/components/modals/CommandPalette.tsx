import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Hammer,
  Bot,
  Database,
  CloudUpload,
  KanbanSquare,
  ShoppingBag,
  CreditCard,
  Sliders,
  Sparkles,
} from 'lucide-react';

export const CommandPalette: React.FC = () => {
  const {
    isCmdPaletteOpen,
    setIsCmdPaletteOpen,
    setActiveTab,
    lang,
    setLang,
    toggleTheme,
  } = useApp();

  const [query, setQuery] = useState('');

  if (!isCmdPaletteOpen) return null;

  const COMMANDS = [
    {
      id: 'c-build',
      titleEn: 'Open Build Studio',
      titleAr: 'فتح استوديو البناء (Build Studio)',
      category: 'Navigation',
      icon: Hammer,
      action: () => setActiveTab('build-studio'),
    },
    {
      id: 'c-ailab',
      titleEn: 'Open AI Lab & Agents',
      titleAr: 'فتح مختبر AI والوكلاء (AI Lab)',
      category: 'Navigation',
      icon: Bot,
      action: () => setActiveTab('ai-lab'),
    },
    {
      id: 'c-db',
      titleEn: 'Open Database & Schema',
      titleAr: 'مخطط البيانات و Backend (PostgreSQL)',
      category: 'Navigation',
      icon: Database,
      action: () => setActiveTab('database'),
    },
    {
      id: 'c-deploy',
      titleEn: 'Deploy to Cloud Run',
      titleAr: 'النشر على Cloud Run / Vercel',
      category: 'Action',
      icon: CloudUpload,
      action: () => setActiveTab('deployment'),
    },
    {
      id: 'c-kanban',
      titleEn: 'Open Kanban Tasks',
      titleAr: 'لوحة المهام وفريق العمل (Kanban)',
      category: 'Navigation',
      icon: KanbanSquare,
      action: () => setActiveTab('kanban'),
    },
    {
      id: 'c-market',
      titleEn: 'Open Templates Marketplace',
      titleAr: 'سوق القوالب والمكونات الجاهزة',
      category: 'Navigation',
      icon: ShoppingBag,
      action: () => setActiveTab('marketplace'),
    },
    {
      id: 'c-billing',
      titleEn: 'Open Billing & Credits',
      titleAr: 'الفواتير وشحن رصيد AI (Credits)',
      category: 'Navigation',
      icon: CreditCard,
      action: () => setActiveTab('billing'),
    },
    {
      id: 'c-lang',
      titleEn: lang === 'en' ? 'Switch to Arabic' : 'Switch to English',
      titleAr: lang === 'en' ? 'التبديل إلى العربية' : 'Switch to English',
      category: 'Settings',
      icon: Sparkles,
      action: () => setLang(lang === 'en' ? 'ar' : 'en'),
    },
    {
      id: 'c-theme',
      titleEn: 'Toggle Theme (Dark / Light)',
      titleAr: 'تبديل المظهر (ليلي / نهاري)',
      category: 'Settings',
      icon: Sliders,
      action: () => toggleTheme(),
    },
  ];

  const filtered = COMMANDS.filter(
    (c) =>
      c.titleEn.toLowerCase().includes(query.toLowerCase()) ||
      c.titleAr.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      onClick={() => setIsCmdPaletteOpen(false)}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-20 p-4 select-none animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl flex flex-col"
      >
        <div className="p-3 border-b border-zinc-800 flex items-center gap-2.5 bg-zinc-950">
          <Search className="w-4 h-4 text-zinc-400 shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              lang === 'ar'
                ? 'ابحث أو نفذ أمراً...'
                : 'Search or run a command...'
            }
            className="w-full bg-transparent text-xs text-zinc-100 placeholder:text-zinc-500 outline-none"
          />
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
            ESC
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto p-1.5 space-y-0.5">
          {filtered.map((cmd) => {
            const Icon = cmd.icon;
            return (
              <button
                key={cmd.id}
                onClick={() => {
                  cmd.action();
                  setIsCmdPaletteOpen(false);
                }}
                className="w-full p-2 rounded-lg hover:bg-zinc-800 flex items-center justify-between text-left text-xs transition"
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-zinc-400" />
                  <span className="font-medium text-zinc-200">
                    {lang === 'ar' ? cmd.titleAr : cmd.titleEn}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-zinc-500">{cmd.category}</span>
              </button>
            );
          })}

          {filtered.length === 0 && (
            <div className="p-6 text-center text-xs text-zinc-500 italic">
              {lang === 'ar' ? 'لم يتم العثور على أوامر' : 'No commands matched'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
