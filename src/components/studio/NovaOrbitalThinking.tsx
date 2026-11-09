import React from 'react';
import { Brain, Cpu, Database, CreditCard, ShieldCheck } from 'lucide-react';

interface NovaOrbitalThinkingProps {
  progress: number;
  elapsedTime: string;
  currentLog: string;
  lang: 'ar' | 'en';
  activePhase?: string;
}

export const NovaOrbitalThinking: React.FC<NovaOrbitalThinkingProps> = ({
  progress,
  elapsedTime,
  currentLog,
  lang,
}) => {
  const isArabic = lang === 'ar';

  const phases = [
    { id: 'REASONING', labelAr: 'الاستدلال', labelEn: 'Reasoning', icon: Brain, pct: 25 },
    { id: 'DATABASE', labelAr: 'قاعدة البيانات', labelEn: 'Database', icon: Database, pct: 50 },
    { id: 'SECURITY', labelAr: 'الأمان والدفع', labelEn: 'Security', icon: CreditCard, pct: 75 },
    { id: 'CODEGEN', labelAr: 'توليد الكود', labelEn: 'Codegen', icon: Cpu, pct: 90 },
    { id: 'DEPLOYED', labelAr: 'النشر الحي', labelEn: 'Deployed', icon: ShieldCheck, pct: 100 },
  ];

  return (
    <div className="w-full rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-100 p-4 shadow-2xl space-y-3 animate-fadeIn select-none relative overflow-hidden backdrop-blur-md">
      {/* Ambient background micro-glow: subtle blue-gray */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar: Compact Badge, Stopwatch & Percentage in Refined Gray */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5 text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] font-black text-zinc-200 shrink-0 shadow-xs">
            ✦
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <span className="font-extrabold text-white text-xs tracking-tight">
              {isArabic ? 'محرك استدلال NOVA' : 'NOVA AI Engine'}
            </span>
            <span className="text-[9px] font-mono font-medium bg-zinc-800 text-zinc-300 border border-zinc-700 px-1.5 py-0.5 rounded">
              {isArabic ? 'معماري الأنظمة' : 'ARCHITECT'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-zinc-950 border border-zinc-800 font-mono text-[11px] text-zinc-300 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-200 animate-pulse" />
            <span>{elapsedTime}</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-lg bg-zinc-800 border border-zinc-700 font-mono font-bold text-xs text-white">
            {progress}%
          </span>
        </div>
      </div>

      {/* Middle: Compact Orbital Indicator & Log in Single Balanced Row */}
      <div className="flex items-center gap-3.5 py-1">
        {/* Compact Refined Orbital Radar (52x52px) in Executive Gray & Subtle Blue */}
        <div className="relative w-13 h-13 shrink-0 flex items-center justify-center">
          {/* Outer Pulsing Subtle Ring */}
          <div className="absolute inset-0 rounded-full border border-zinc-700/60 animate-ping opacity-25" />
          
          {/* Static Thin Guide Ring */}
          <div className="absolute inset-1 rounded-full border border-dashed border-zinc-700" />

          {/* Primary Orbital Rotation with 3 Micro Orbiting Nodes (Blue / Indigo / Slate) */}
          <div className="absolute inset-0 rounded-full animate-spin [animation-duration:2.8s]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
            <div className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_6px_rgba(129,140,248,0.7)]" />
            <div className="absolute bottom-1 left-1 w-1.5 h-1.5 rounded-full bg-slate-300 shadow-[0_0_6px_rgba(203,213,225,0.7)]" />
          </div>

          {/* Counter-Clockwise Micro Orbit */}
          <div className="absolute inset-2 rounded-full animate-[spin_3.5s_linear_infinite_reverse]">
            <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-300/80" />
          </div>

          {/* Center Micro Core */}
          <div className="w-6 h-6 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center shadow-inner z-10">
            <Brain className="w-3 h-3 text-zinc-200 animate-pulse" />
          </div>
        </div>

        {/* Action Log Text */}
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-zinc-400">
              {isArabic ? 'استدلال وبناء المنظومة:' : 'Active Synthesis Stream:'}
            </span>
            <span className="text-zinc-300 font-semibold text-[10px] bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700">
              {progress < 40 ? (isArabic ? 'تحليل المتطلبات' : 'Decomposing') : progress < 80 ? (isArabic ? 'برمجة الكيانات' : 'Codegen') : (isArabic ? 'نشر المنظومة' : 'Deploying')}
            </span>
          </div>
          <p className="text-xs font-mono font-medium text-zinc-200 truncate">
            {currentLog || (isArabic ? 'جارٍ تفكيك النموذج وتوليد المنظومة الحقيقية...' : 'Decomposing architecture & synthesizing...')}
          </p>
        </div>
      </div>

      {/* Clean Linear Progress Track: Subtle Blue to Slate */}
      <div className="w-full h-1.5 rounded-full bg-zinc-950 border border-zinc-800 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-zinc-400 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Compact 5-Phase Micro Pills in Refined Monochrome Gray */}
      <div className="grid grid-cols-5 gap-1 pt-1">
        {phases.map((ph) => {
          const isCompleted = progress >= ph.pct;
          const Icon = ph.icon;

          return (
            <div
              key={ph.id}
              className={`py-1 px-1.5 rounded-lg border text-center transition flex items-center justify-center gap-1 ${
                isCompleted
                  ? 'bg-zinc-800 border-zinc-700 text-zinc-200 font-semibold'
                  : 'bg-zinc-950/60 border-zinc-850 text-zinc-500'
              }`}
            >
              <Icon className="w-3 h-3 shrink-0" />
              <span className="text-[9px] font-mono truncate hidden sm:inline">
                {isArabic ? ph.labelAr : ph.labelEn}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
