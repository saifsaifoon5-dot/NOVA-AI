import React from 'react';
import { useApp } from '../../context/AppContext';
import { WelcomeParticleHero } from './WelcomeParticleHero';
import {
  Hammer,
  Bot,
  ExternalLink,
  Cpu,
  CreditCard,
  CheckCircle2,
  Database,
  CloudUpload,
  Layers,
  ArrowRight
} from 'lucide-react';

export const DashboardStudio: React.FC = () => {
  const { lang, project, credits, setActiveTab, setViewMode, userPlan } = useApp();

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-zinc-950 text-zinc-100">
      {/* Top Header */}
      <div className="h-12 border-b border-zinc-800/80 bg-zinc-950 px-4 sm:px-6 flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-2.5">
          <Cpu className="w-4 h-4 text-zinc-400" />
          <h2 className="text-xs font-semibold text-zinc-100">
            {lang === 'ar' ? 'لوحة التحكم والعمليات (Mission Control)' : 'Mission Control Overview'}
          </h2>
        </div>

        <button
          onClick={() => setActiveTab('build-studio')}
          className="px-3.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
        >
          <Hammer className="w-3.5 h-3.5" />
          <span>{lang === 'ar' ? 'فتح استوديو البناء' : 'Open App Builder'}</span>
        </button>
      </div>

      {/* Main Content Area - Generous full-width layout without cramped borders */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 w-full">
        {/* 1. Interactive 3D Particle Welcome Hero */}
        <WelcomeParticleHero />

        {/* 2. Active Project & Pipeline Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Active Project Card */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/90 flex flex-col justify-between space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-zinc-400 font-mono tracking-wider">ACTIVE BLUEPRINT</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  READY & LIVE
                </span>
              </div>
              <h3 className="text-lg font-bold text-zinc-100">{project.name}</h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">{project.description}</p>
            </div>

            <div className="pt-4 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3 text-xs text-zinc-400 font-mono">
                <span className="px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-300">{project.framework}</span>
                <span className="px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-300">{project.database}</span>
                <span>{project.components.length} components</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('build-studio')}
                  className="px-4 py-2 bg-zinc-100 hover:bg-white text-zinc-950 rounded-xl text-xs font-semibold transition shadow-xs"
                >
                  {lang === 'ar' ? 'تعديل في المحرر' : 'Launch Studio Editor'}
                </button>
                <button
                  onClick={() => {
                    setActiveTab('build-studio');
                    setViewMode('split');
                  }}
                  className="px-3 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-300 hover:text-white rounded-xl text-xs font-medium transition"
                  title="Open Split View"
                >
                  {lang === 'ar' ? 'معاينة متزامنة' : 'Split Sandbox'}
                </button>
              </div>
            </div>
          </div>

          {/* Secure Payment Gateway & Subscription Badge */}
          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/90 flex flex-col justify-between space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-zinc-400 font-mono tracking-wider">ENTERPRISE SECURE PAY</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono text-amber-300 bg-amber-950/40 border border-amber-800/50">
                  {userPlan}
                </span>
              </div>
              <h4 className="text-base font-semibold text-zinc-100">Payments & Subscriptions</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {lang === 'ar'
                  ? 'بوابات الدفع المشفرة المعتمدة مفعلة مع شحن فوري لرصيد الذكاء الاصطناعي.'
                  : 'Recurring billing and AI synthesis tokens fully synced with Secure Gateway.'}
              </p>
            </div>

            <div className="space-y-3 pt-3 border-t border-zinc-800/80">
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-400">Available Credits</span>
                <span className="font-mono text-amber-400 font-bold text-sm">{credits.toLocaleString()} cr</span>
              </div>
              <button
                onClick={() => setActiveTab('billing')}
                className="w-full py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200 text-xs font-semibold transition flex items-center justify-center gap-2"
              >
                <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                <span>{lang === 'ar' ? 'إدارة الاشتراك وشحن الرصيد' : 'Manage Billing & Top-Up'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3. High-Value Studio Quick Launcher Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div 
            onClick={() => setActiveTab('ai-lab')}
            className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-800 hover:border-zinc-700 cursor-pointer transition group"
          >
            <div className="flex items-center justify-between mb-2">
              <Bot className="w-5 h-5 text-indigo-400" />
              <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 group-hover:translate-x-0.5 transition" />
            </div>
            <h4 className="text-xs font-semibold text-zinc-200">Gemini 3.8 AI Lab</h4>
            <p className="text-[11px] text-zinc-400 mt-0.5">Multimodal playground, OCR & agent chains</p>
          </div>

          <div 
            onClick={() => setActiveTab('database')}
            className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-800 hover:border-zinc-700 cursor-pointer transition group"
          >
            <div className="flex items-center justify-between mb-2">
              <Database className="w-5 h-5 text-cyan-400" />
              <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 group-hover:translate-x-0.5 transition" />
            </div>
            <h4 className="text-xs font-semibold text-zinc-200">PostgreSQL Cloud DB</h4>
            <p className="text-[11px] text-zinc-400 mt-0.5">Visual table architect, indexes & SQL editor</p>
          </div>

          <div 
            onClick={() => setActiveTab('deployment')}
            className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-800 hover:border-zinc-700 cursor-pointer transition group"
          >
            <div className="flex items-center justify-between mb-2">
              <CloudUpload className="w-5 h-5 text-emerald-400" />
              <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 group-hover:translate-x-0.5 transition" />
            </div>
            <h4 className="text-xs font-semibold text-zinc-200">Cloud Run & PWA</h4>
            <p className="text-[11px] text-zinc-400 mt-0.5">Automated container build, DNS & native bundle</p>
          </div>
        </div>
      </div>
    </div>
  );
};
