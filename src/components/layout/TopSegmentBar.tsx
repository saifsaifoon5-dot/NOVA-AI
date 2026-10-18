import React from 'react';
import { useApp } from '../../context/AppContext';
import { AppTab } from '../../types';
import {
  LayoutDashboard,
  Hammer,
  Bot,
  Database,
  CloudUpload,
  CreditCard,
  Columns2,
  Maximize2,
  LayoutGrid,
  Minimize2,
  Menu,
} from 'lucide-react';

interface QuickTab {
  id: AppTab;
  labelEn: string;
  labelAr: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeEn?: string;
  badgeAr?: string;
  badgeType?: 'pay' | 'gemini' | 'core';
}

const QUICK_TABS: QuickTab[] = [
  { id: 'build-studio', labelEn: 'App Builder', labelAr: 'استوديو البناء', icon: Hammer, badgeEn: 'Core', badgeAr: 'الأساسي', badgeType: 'core' },
  { id: 'ai-lab', labelEn: 'AI Lab', labelAr: 'مختبر AI', icon: Bot, badgeEn: 'NOVA', badgeAr: 'نوفا', badgeType: 'gemini' },
  { id: 'dashboard', labelEn: 'Mission Control', labelAr: 'لوحة المشاريع', icon: LayoutDashboard },
  { id: 'database', labelEn: 'Database', labelAr: 'قواعد البيانات', icon: Database },
  { id: 'deployment', labelEn: 'Cloud Run', labelAr: 'النشر السحابي', icon: CloudUpload },
  { id: 'billing', labelEn: 'Billing & Plans', labelAr: 'الاشتراكات وبوابة الدفع', icon: CreditCard, badgeEn: 'Secure Pay', badgeAr: 'دفع آمن', badgeType: 'pay' },
];

export const TopSegmentBar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    viewMode,
    setViewMode,
    lang,
    userPlan,
    addToast,
  } = useApp();

  const isFullZen = viewMode === 'focus';

  const handleToggleFullZen = () => {
    if (isFullZen) {
      setViewMode('standard');
      addToast(
        lang === 'ar' ? 'تم الرجوع إلى العرض القياسي' : 'Returned to Standard Layout',
        'info'
      );
    } else {
      setViewMode('focus');
      addToast(
        lang === 'ar' ? 'تم تفعيل وضع الشاشة الكاملة (100% مساحة عمل)' : 'Activated Fullscreen View (100% Canvas)',
        'success'
      );
    }
  };

  return (
    <div className="h-12 border-b border-zinc-800/80 bg-zinc-950/95 backdrop-blur px-3 sm:px-6 flex items-center justify-between gap-4 shrink-0 select-none z-20">
      {/* Left: Quick Switcher Bar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {/* Primary Studio Quick Switcher */}
        <div className="flex items-center bg-zinc-900/80 p-0.5 rounded-xl border border-zinc-800 shrink-0">
          {QUICK_TABS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition shrink-0 ${
                  isActive
                    ? 'bg-zinc-800 text-white shadow-xs font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-zinc-100' : 'text-zinc-400'}`} />
                <span>{lang === 'ar' ? item.labelAr : item.labelEn}</span>

                {(lang === 'ar' ? item.badgeAr : item.badgeEn) && (
                  <span
                    className={`text-[9px] font-mono px-1 py-0.2 rounded ${
                      item.badgeType === 'pay'
                        ? 'bg-amber-400/10 text-amber-300 border border-amber-400/20'
                        : item.badgeType === 'gemini'
                        ? 'bg-indigo-400/10 text-indigo-300 border border-indigo-400/20'
                        : 'bg-zinc-700 text-zinc-300'
                    }`}
                  >
                    {lang === 'ar' ? item.badgeAr : item.badgeEn}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: View Modes & Subscription Badge */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Active Subscription Badge */}
        <button
          onClick={() => setActiveTab('billing')}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-xs transition text-zinc-300"
          title={lang === 'ar' ? 'إدارة الاشتراك وبوابة الدفع المشفرة' : 'Manage Subscription & Secure Payment Gateway'}
        >
          <CreditCard className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[11px] font-medium text-amber-300">{userPlan}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </button>

        {/* View Mode Separator Buttons */}
        <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-0.5 text-xs">
          {/* Standard View */}
          <button
            onClick={() => setViewMode('standard')}
            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium flex items-center gap-1 transition ${
              viewMode === 'standard'
                ? 'bg-zinc-800 text-white shadow-xs'
                : 'text-zinc-400 hover:text-white'
            }`}
            title="Standard Layout"
          >
            <LayoutGrid className="w-3 h-3" />
            <span className="hidden sm:inline">{lang === 'ar' ? 'افتراضي' : 'Standard'}</span>
          </button>

          {/* Split Mode */}
          <button
            onClick={() => {
              setViewMode('split');
              if (activeTab !== 'build-studio') setActiveTab('build-studio');
            }}
            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium flex items-center gap-1 transition ${
              viewMode === 'split'
                ? 'bg-zinc-800 text-white shadow-xs'
                : 'text-zinc-400 hover:text-white'
            }`}
            title="Side-by-side prompt and live preview"
          >
            <Columns2 className="w-3 h-3" />
            <span className="hidden sm:inline">{lang === 'ar' ? 'معاينة متزامنة' : 'Split View'}</span>
          </button>

          {/* Full View / Zen Collapse Button */}
          <button
            onClick={handleToggleFullZen}
            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium flex items-center gap-1 transition ${
              isFullZen
                ? 'bg-zinc-100 text-zinc-950 font-semibold shadow-xs'
                : 'text-zinc-400 hover:text-white'
            }`}
            title={isFullZen ? 'Exit Full View' : 'Full View (100% Studio Canvas)'}
          >
            {isFullZen ? <Minimize2 className="w-3 h-3 text-zinc-950" /> : <Maximize2 className="w-3 h-3" />}
            <span>{isFullZen ? (lang === 'ar' ? 'تصغير' : 'Exit Full') : (lang === 'ar' ? 'ملء الشاشة' : 'Full View')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
