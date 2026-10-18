import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AppTab } from '../../types';
import {
  Hammer,
  Bot,
  LayoutDashboard,
  Database,
  CloudUpload,
  KanbanSquare,
  ShoppingBag,
  CreditCard,
  BarChart3,
  Sliders,
  X,
  Search,
  Sparkles,
  Cpu,
  Coins,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface NavModule {
  id: AppTab;
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
  icon: React.ComponentType<{ className?: string }>;
  tag?: string;
}

interface ModuleSection {
  titleEn: string;
  titleAr: string;
  modules: NavModule[];
}

const MODULE_SECTIONS: ModuleSection[] = [
  {
    titleEn: 'Core Studios',
    titleAr: 'الاستوديوهات الرئيسية',
    modules: [
      {
        id: 'build-studio',
        titleEn: 'App Builder',
        titleAr: 'استوديو بناء التطبيقات',
        descEn: 'Full-stack prompt-to-app generator',
        descAr: 'توليد التطبيقات الفوري والشاشات',
        icon: Hammer,
        tag: 'Primary',
      },
      {
        id: 'ai-lab',
        titleEn: 'AI Lab & Agents',
        titleAr: 'مختبر AI والوكلاء',
        descEn: 'NOVA AI & Agent Planner',
        descAr: 'تجارب النماذج وسلاسل الوكلاء',
        icon: Bot,
        tag: 'NOVA 3.0',
      },
      {
        id: 'dashboard',
        titleEn: 'Mission Control',
        titleAr: 'مركز العمليات والمشاريع',
        descEn: 'Project telemetry & launchpad',
        descAr: 'نظرة شاملة وإطلاق سريع',
        icon: LayoutDashboard,
      },
    ],
  },
  {
    titleEn: 'Backend & Cloud',
    titleAr: 'قواعد البيانات والسحابة',
    modules: [
      {
        id: 'database',
        titleEn: 'PostgreSQL Database',
        titleAr: 'قواعد البيانات وجداول SQL',
        descEn: 'Visual schema architect & SQL queries',
        descAr: 'تصميم الجداول والاستعلامات',
        icon: Database,
      },
      {
        id: 'deployment',
        titleEn: 'Cloud Run & PWA',
        titleAr: 'النشر السحابي و PWA',
        descEn: 'Serverless containers & native web app',
        descAr: 'حاويات جاهزة ونشر فوري',
        icon: CloudUpload,
      },
    ],
  },
  {
    titleEn: 'Workflows & Marketplace',
    titleAr: 'المهام وسوق القوالب',
    modules: [
      {
        id: 'kanban',
        titleEn: 'Kanban Tasks',
        titleAr: 'لوحة إدارة المهام',
        descEn: 'Agile sprint & milestone board',
        descAr: 'تتبع مراحل التطوير والمهام',
        icon: KanbanSquare,
      },
      {
        id: 'marketplace',
        titleEn: 'Templates Marketplace',
        titleAr: 'سوق القوالب الجاهزة',
        descEn: 'Verified SaaS & AI boilerplates',
        descAr: 'قوالب SaaS وأنظمة متكاملة',
        icon: ShoppingBag,
      },
    ],
  },
  {
    titleEn: 'Billing & Settings',
    titleAr: 'الاشتراكات والإعدادات',
    modules: [
      {
        id: 'billing',
        titleEn: 'Billing & Plans',
        titleAr: 'الاشتراكات وبوابة الدفع',
        descEn: 'Subscriptions, credit top-up & invoices',
        descAr: 'إدارة الخطط وبوابة الدفع المشفرة',
        icon: CreditCard,
        tag: 'Payments',
      },
      {
        id: 'analytics',
        titleEn: 'Metrics & Analytics',
        titleAr: 'التحليلات ومقاييس الأداء',
        descEn: 'Usage telemetry, API latencies & errors',
        descAr: 'إحصائيات الاستهلاك والسرعة',
        icon: BarChart3,
      },
      {
        id: 'settings',
        titleEn: 'Settings & API Keys',
        titleAr: 'الإعدادات ومفاتيح الربط',
        descEn: 'Payment keys, model overrides & env',
        descAr: 'مفاتيح بوابة الدفع وإعدادات البيئة',
        icon: Sliders,
      },
    ],
  },
];

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    lang,
    isSidebarOpen,
    setIsSidebarOpen,
    userPlan,
    credits,
    addCredits,
    currentUser,
    setIsAuthModalOpen,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');

  if (!isSidebarOpen) {
    return null;
  }

  const handleSelectModule = (tab: AppTab) => {
    setActiveTab(tab);
    setIsSidebarOpen(false); // Seamlessly return full screen to user!
  };

  const filteredSections = MODULE_SECTIONS.map((section) => ({
    ...section,
    modules: section.modules.filter((m) => {
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        m.titleEn.toLowerCase().includes(q) ||
        m.titleAr.toLowerCase().includes(q) ||
        m.descEn.toLowerCase().includes(q) ||
        m.descAr.toLowerCase().includes(q)
      );
    }),
  })).filter((s) => s.modules.length > 0);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setIsSidebarOpen(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 transition-opacity animate-fadeIn"
      />

      {/* Slide-out Organized Navigation Drawer */}
      <aside
        className={`fixed inset-y-0 ${
          lang === 'ar' ? 'right-0' : 'left-0'
        } w-80 sm:w-96 bg-zinc-950 border-x border-zinc-800/90 shadow-2xl z-50 flex flex-col justify-between select-none animate-slideIn`}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-zinc-800/80 bg-zinc-900/40 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-white text-xs">
                LGS
              </div>
              <div>
                <h3 className="text-xs font-bold text-white tracking-tight">
                  {lang === 'ar' ? 'أقسام المنصة والأدوات' : 'Platform Modules'}
                </h3>
                <span className="text-[10px] text-zinc-400 font-mono">
                  {lang === 'ar' ? 'اختر أداة لفتحها ملء الشاشة' : 'Select module to expand fullscreen'}
                </span>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition"
              title={lang === 'ar' ? 'إغلاق القائمة' : 'Close navigation menu'}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative">
            <Search className={`w-3.5 h-3.5 text-zinc-500 absolute top-2.5 ${lang === 'ar' ? 'right-2.5' : 'left-2.5'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'ar' ? 'ابحث في الأدوات...' : 'Search modules...'}
              className={`w-full py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 placeholder:text-zinc-500 outline-none focus:border-zinc-600 transition ${
                lang === 'ar' ? 'pr-8 pl-3' : 'pl-8 pr-3'
              }`}
            />
          </div>
        </div>

        {/* Modules List - Organized Clean Sections */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {filteredSections.map((sec, secIdx) => (
            <div key={secIdx} className="space-y-1.5">
              <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500 font-mono">
                {lang === 'ar' ? sec.titleAr : sec.titleEn}
              </div>

              <div className="space-y-1">
                {sec.modules.map((m) => {
                  const Icon = m.icon;
                  const isActive = activeTab === m.id;

                  return (
                    <button
                      key={m.id}
                      onClick={() => handleSelectModule(m.id)}
                      className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between gap-3 transition ${
                        isActive
                          ? 'bg-zinc-800 border border-zinc-700 text-white shadow-xs'
                          : 'bg-zinc-900/30 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 text-zinc-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`p-2 rounded-lg shrink-0 ${
                            isActive
                              ? 'bg-zinc-700 text-white'
                              : 'bg-zinc-900 text-zinc-400 group-hover:text-zinc-200'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold truncate text-zinc-100">
                              {lang === 'ar' ? m.titleAr : m.titleEn}
                            </span>
                            {m.tag && (
                              <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 shrink-0">
                                {m.tag}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                            {lang === 'ar' ? m.descAr : m.descEn}
                          </p>
                        </div>
                      </div>

                      <ArrowRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Drawer Bottom - Account & Engine State */}
        <div className="p-3 border-t border-zinc-800/80 bg-zinc-900/40 space-y-2.5">
          {/* User Account Trigger */}
          <button
            onClick={() => {
              setIsAuthModalOpen(true);
              setIsSidebarOpen(false);
            }}
            className="w-full p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 flex items-center justify-between text-left transition"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                alt="Avatar"
                className="w-8 h-8 rounded-full object-cover border border-zinc-700 shrink-0"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-white truncate">{currentUser?.name}</span>
                  {currentUser?.verified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                </div>
                <span className="text-[10px] text-zinc-400 truncate block font-mono">{currentUser?.email}</span>
              </div>
            </div>
            <span className="text-[10px] font-semibold text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded-md border border-blue-800 shrink-0">
              {lang === 'ar' ? 'إدارة' : 'Manage'}
            </span>
          </button>

          {/* Active Plan Card */}
          <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-[11px] font-semibold text-zinc-200">{userPlan}</span>
              </div>
              <span className="text-[10px] text-zinc-400 font-mono">
                {credits.toLocaleString()} {lang === 'ar' ? 'رصيد متاح' : 'credits remaining'}
              </span>
            </div>

            <button
              onClick={() => {
                setActiveTab('billing');
                setIsSidebarOpen(false);
              }}
              className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] font-medium border border-zinc-700 transition"
            >
              {lang === 'ar' ? 'ترقية / شحن' : 'Manage'}
            </button>
          </div>

          {/* Engine indicator */}
          <div className="flex items-center justify-between px-1 text-[11px] text-zinc-500 font-mono">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3 h-3 text-zinc-400" />
              <span>Gemini 3.8 Flash</span>
            </span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {lang === 'ar' ? 'متصل' : 'Online'}
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
