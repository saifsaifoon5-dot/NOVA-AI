import React from 'react';
import { useApp } from '../../context/AppContext';
import { Cpu, FileCode, CheckCircle2, Activity } from 'lucide-react';

export const GlobalBuildProgress: React.FC = () => {
  const { globalBuildState, lang } = useApp();
  const isArabic = lang === 'ar';

  if (!globalBuildState.isBuilding) return null;

  return (
    <div
      dir={isArabic ? 'rtl' : 'ltr'}
      className="w-full bg-zinc-950 border-b border-zinc-800/80 z-30 transition-all animate-fadeIn"
    >
      {/* 1. Top Linear Shimmering Progress Bar */}
      <div className="w-full h-1 bg-zinc-900 overflow-hidden relative">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 transition-all duration-300 ease-out shadow-sm shadow-emerald-500/50"
          style={{ width: `${Math.max(globalBuildState.progress, 4)}%` }}
        />
      </div>

      {/* 2. Compact Real-Time Status Ticker */}
      <div className="h-8 px-4 flex items-center justify-between text-xs font-mono bg-zinc-900/60 backdrop-blur-md">
        <div className="flex items-center gap-2.5 truncate">
          <div className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </div>
          <span className="text-zinc-300 font-bold flex items-center gap-1.5 truncate">
            <Cpu className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="truncate">
              {globalBuildState.statusMessage || (isArabic ? 'وكيل Gemini يقوم بالبناء الحقيقي...' : 'Gemini Build Agent processing...')}
            </span>
          </span>
          {globalBuildState.activeFile && (
            <span className="hidden sm:flex items-center gap-1 text-[11px] text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded-md border border-zinc-800 truncate">
              <FileCode className="w-3 h-3 text-cyan-400 shrink-0" />
              <span className="truncate">{globalBuildState.activeFile}</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <span className="text-[10px] text-zinc-500 hidden md:inline">
            {globalBuildState.modelUsed.toUpperCase()}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-400 font-bold text-[11px]">
            {globalBuildState.progress}%
          </span>
        </div>
      </div>
    </div>
  );
};
