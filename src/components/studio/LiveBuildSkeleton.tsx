import React from 'react';
import { Terminal, Cpu, Database, CreditCard, ShieldCheck, FileCode, Sparkles, Layers, Activity } from 'lucide-react';
import { BuildStreamProgressEvent } from '../../services/geminiService';

interface LiveBuildSkeletonProps {
  progressEvent?: BuildStreamProgressEvent | null;
  progress: number;
  statusMessage?: string;
  activeFile?: string;
  codeSnippet?: string;
  engine?: string;
  isArabic: boolean;
}

export const LiveBuildSkeleton: React.FC<LiveBuildSkeletonProps> = ({
  progress,
  statusMessage,
  activeFile,
  codeSnippet,
  engine = 'NOVA ARCHITECT v3.8',
  isArabic,
}) => {
  return (
    <div
      dir={isArabic ? 'rtl' : 'ltr'}
      className="relative w-full h-full min-h-[580px] bg-zinc-950 flex flex-col overflow-hidden select-none"
    >
      {/* =================================================================== */}
      {/* 1. BACKGROUND APP SKELETON (SHIMMERING PROTOTYPE LAYOUT)             */}
      {/* =================================================================== */}
      <div className="absolute inset-0 p-5 sm:p-7 space-y-6 opacity-35 filter blur-[0.5px] pointer-events-none overflow-hidden">
        {/* Skeleton Header */}
        <div className="flex items-center justify-between p-4 rounded-3xl bg-zinc-900/50 border border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-zinc-800 animate-pulse" />
            <div className="space-y-1.5">
              <div className="w-32 h-4 rounded-md bg-zinc-800 animate-pulse" />
              <div className="w-48 h-3 rounded-md bg-zinc-850 animate-pulse" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-24 h-8 rounded-xl bg-zinc-800 animate-pulse hidden sm:block" />
            <div className="w-20 h-8 rounded-xl bg-zinc-700/60 animate-pulse" />
          </div>
        </div>

        {/* Skeleton 4 KPI Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-2">
              <div className="w-20 h-3 rounded bg-zinc-800 animate-pulse" />
              <div className="w-28 h-6 rounded bg-zinc-750 animate-pulse" />
              <div className="w-16 h-2.5 rounded bg-zinc-850 animate-pulse" />
            </div>
          ))}
        </div>

        {/* Skeleton Filters & Search */}
        <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-zinc-900/30 border border-zinc-800/60">
          <div className="flex items-center gap-2 overflow-x-auto">
            <div className="w-16 h-7 rounded-xl bg-zinc-800 animate-pulse" />
            <div className="w-20 h-7 rounded-xl bg-zinc-850 animate-pulse" />
            <div className="w-20 h-7 rounded-xl bg-zinc-850 animate-pulse" />
            <div className="w-24 h-7 rounded-xl bg-zinc-850 animate-pulse hidden sm:block" />
          </div>
          <div className="w-48 h-7 rounded-xl bg-zinc-850 animate-pulse" />
        </div>

        {/* Skeleton Content Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-28 h-4 rounded bg-zinc-800 animate-pulse" />
                <div className="w-12 h-4 rounded-full bg-zinc-850 animate-pulse" />
              </div>
              <div className="w-full h-3 rounded bg-zinc-850 animate-pulse" />
              <div className="flex items-center justify-between pt-2">
                <div className="w-16 h-4 rounded bg-zinc-800 animate-pulse" />
                <div className="w-20 h-7 rounded-xl bg-zinc-800 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =================================================================== */}
      {/* 2. REAL-TIME NOVA BUILD AGENT HUD TERMINAL OVERLAY                  */}
      {/* =================================================================== */}
      <div className="relative z-20 flex-1 flex items-center justify-center p-4 sm:p-6 backdrop-blur-[2px]">
        <div className="w-full max-w-xl bg-zinc-900/95 border border-zinc-700/80 rounded-3xl p-5 sm:p-6 shadow-2xl shadow-black/80 space-y-4 ring-1 ring-white/10 animate-fadeIn">
          {/* Top Header */}
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
              </div>
              <div className="text-start">
                <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-blue-400" />
                  <span>{isArabic ? 'محرك استدلال NOVA: بث التنفيذ والتوليد المباشر' : 'NOVA Architectural Engine: Live Execution'}</span>
                </h3>
                <p className="text-[10px] text-zinc-400 font-mono mt-0.5">
                  {isArabic ? `${engine} · توليد وتجميع حي للأكواد` : `${engine} · REAL-TIME CODE SYNTHESIS`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-xl bg-zinc-800 border border-zinc-700/80 text-zinc-200 text-xs font-mono font-bold">
                {progress}%
              </span>
            </div>
          </div>

          {/* Elegant Executive Gradient Progress Bar */}
          <div className="space-y-1.5">
            <div className="w-full h-2 rounded-full bg-zinc-950 border border-zinc-800 overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-zinc-400 rounded-full transition-all duration-300 ease-out shadow-xs"
                style={{ width: `${Math.max(progress, 6)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
              <span className="flex items-center gap-1.5 text-zinc-300 font-bold">
                <Activity className="w-3 h-3 text-blue-400 animate-pulse" />
                <span>{statusMessage || (isArabic ? 'جاري تحليل المتطلبات وتوليد الأكواد...' : 'Analyzing & writing code...')}</span>
              </span>
              <span className="text-zinc-500 text-[10px]">
                {isArabic ? 'برمجة مخصصة 100%' : '100% Bespoke Code'}
              </span>
            </div>
          </div>

          {/* Active File & Line Diff Status */}
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs font-mono">
            <div className="flex items-center gap-2 text-zinc-300 truncate">
              <FileCode className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="text-zinc-500">{isArabic ? 'الملف الحالي:' : 'Active File:'}</span>
              <span className="text-white font-bold truncate">{activeFile || 'src/App.tsx'}</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-800 border border-zinc-700 text-zinc-300 shrink-0">
              {isArabic ? 'ذاكرة البث المباشر' : 'LIVE BUFFER'}
            </span>
          </div>

          {/* Real-Time Live Code Stream Box */}
          <div className="p-3.5 rounded-2xl bg-zinc-950/90 border border-zinc-800/90 text-[11px] font-mono text-zinc-300 space-y-1.5 overflow-hidden">
            <div className="flex items-center justify-between text-[10px] text-zinc-500 pb-1 border-b border-zinc-900">
              <div className="flex items-center gap-1.5">
                <Terminal className="w-3 h-3 text-zinc-400" />
                <span>{isArabic ? 'بث طرفية الأكواد الحية' : 'TERMINAL CODE STREAM'}</span>
              </div>
              <span className="text-blue-400 font-bold animate-pulse">
                {isArabic ? '● جاري التجميع' : '● COMPILING'}
              </span>
            </div>
            <pre className="text-zinc-300 whitespace-pre-wrap font-mono text-[11px] max-h-28 overflow-y-auto leading-relaxed select-text">
              {codeSnippet || (isArabic ? `// بناء الأكواد المخصصة عبر NOVA AI...\nexport default function App() {\n  return <div className="min-h-screen bg-zinc-950 text-white" />;\n}` : `// Synthesizing production code with NOVA AI...\nexport default function App() {\n  return <div className="min-h-screen bg-zinc-950 text-white" />;\n}`)}
            </pre>
          </div>

          {/* Security & Verification Invariants */}
          <div className="flex items-center justify-between pt-1 text-[10px] text-zinc-400 font-mono">
            <span className="flex items-center gap-1 text-zinc-400">
              <ShieldCheck className="w-3 h-3 text-zinc-300" />
              <span>{isArabic ? 'معايير FIPS 140-3 والفوترة الضريبية ZATCA' : 'FIPS 140-3 & ZATCA Phase 2'}</span>
            </span>
            <span className="text-zinc-500">
              {isArabic ? 'بث البيانات متصل بالنظام' : 'Connected via System Stream'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
