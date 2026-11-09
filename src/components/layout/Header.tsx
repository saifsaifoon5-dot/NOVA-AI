import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Globe, 
  Sun, 
  Moon, 
  Search, 
  Coins, 
  Rocket, 
  Keyboard, 
  Menu,
  ShieldCheck,
  CreditCard,
  Settings
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    lang,
    setLang,
    theme,
    toggleTheme,
    project,
    credits,
    addCredits,
    activeTab,
    setActiveTab,
    toggleSidebar,
    userPlan,
    setIsCmdPaletteOpen,
    setIsShortcutsOpen,
    currentUser,
    setIsAuthModalOpen,
  } = useApp();

  return (
    <header className="h-14 border-b border-zinc-800/80 bg-zinc-950 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Brand & Workspace Info */}
      <div className="flex items-center gap-2.5 min-w-0 shrink-0">
        {/* Prominent Sidebar Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition shadow-xs shrink-0"
          title={lang === 'ar' ? 'فتح قائمة الأدوات والاستوديوهات' : 'Open modules drawer'}
        >
          <Menu className="w-4 h-4 text-zinc-400" />
          <span className="text-xs font-semibold hidden sm:inline">
            {lang === 'ar' ? 'الأدوات' : 'Modules'}
          </span>
        </button>

        <div 
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-2 cursor-pointer group shrink-0"
        >
          <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center font-black text-white text-xs group-hover:border-zinc-500 transition shadow-xs tracking-wider">
            NOVA
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-1.5" dir="ltr">
              <span className="font-bold text-zinc-100 text-xs tracking-tight">NOVA Platform</span>
              <span className="text-[9px] text-emerald-400 font-mono font-bold bg-emerald-950/80 px-1 py-0.2 rounded border border-emerald-800">
                {lang === 'ar' ? 'معتمد' : 'Verified'}
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 truncate max-w-[170px] leading-none mt-0.5">
              {lang === 'ar' ? 'المنصة الرسمية للأعمال والدفع الإلكتروني' : 'Official Business & Payments'}
            </p>
          </div>
        </div>
      </div>

      {/* Center Search / Command Launcher */}
      <button
        onClick={() => setIsCmdPaletteOpen(true)}
        className="hidden lg:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 text-zinc-400 text-xs transition-colors max-w-xs w-full mx-4 justify-between"
      >
        <div className="flex items-center gap-2 truncate">
          <Search className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <span className="truncate">{lang === 'ar' ? 'البحث أو تنفيذ أمر سريع...' : 'Search or execute command...'}</span>
        </div>
        <kbd className="font-mono text-[10px] bg-zinc-800 px-1 py-0.5 rounded text-zinc-400 border border-zinc-700 shrink-0">
          ⌘K
        </kbd>
      </button>

      {/* Right Controls - Streamlined & Clutter-Free */}
      <div className="flex items-center gap-1.5 sm:gap-2 flex-nowrap shrink-0">
        {/* Credits & Plan Pill */}
        <button
          onClick={() => setActiveTab('billing')}
          title={lang === 'ar' ? `الباقة الحالية: ${userPlan} • رصيد النقاط: ${credits}` : `Current Plan: ${userPlan} • Credits: ${credits}`}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-xs transition text-zinc-300 shrink-0 shadow-xs"
        >
          <Coins className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="font-mono text-[11px] font-bold text-white">{credits.toLocaleString()}</span>
          <span className="text-[10px] text-zinc-400 hidden md:inline font-mono">({userPlan})</span>
        </button>

        {/* Standalone Live Website Link (Direct public app link) */}
        <a
          href={
            typeof window !== 'undefined'
              ? window.location.host.includes('run.app')
                ? `https://${window.location.host.replace('ais-dev-', 'ais-pre-')}/live`
                : `${window.location.origin}/live`
              : '/live'
          }
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold transition shadow-xs active:scale-95 shrink-0"
          title={lang === 'ar' ? 'فتح الموقع المستقل المباشر للمستخدمين دون واجهة الاستوديو' : 'Open live standalone web app'}
        >
          <Globe className="w-3.5 h-3.5 text-zinc-950 shrink-0" />
          <span className="hidden xs:inline">{lang === 'ar' ? 'الموقع المباشر ↗' : 'Live App ↗'}</span>
        </a>

        {/* Universal Language Switcher */}
        <button
          onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
          className="px-2.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-zinc-200 hover:text-white text-xs flex items-center gap-1.5 transition shrink-0 font-medium active:scale-95 shadow-xs"
          title={lang === 'en' ? 'التحويل إلى اللغة العربية (RTL)' : 'Switch to English (LTR)'}
        >
          <span className="text-xs">🌐</span>
          <span className="font-bold text-[11px]">{lang === 'en' ? 'العربية' : 'EN'}</span>
        </button>

        {/* Global Settings & System Preferences */}
        <button
          onClick={() => setActiveTab('settings')}
          className={`p-2 rounded-xl border transition shrink-0 shadow-xs active:scale-95 cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-emerald-500 text-zinc-950 border-emerald-400 font-bold shadow-sm'
              : 'bg-zinc-900 hover:bg-zinc-850 border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white'
          }`}
          title={lang === 'ar' ? 'الإعدادات العامة، مفاتيح API، وتخصيص المنظومة' : 'Global Settings, API Keys & Preferences'}
        >
          <Settings className="w-3.5 h-3.5" />
        </button>

        {/* User Account / Sign In Trigger with Official Logos & VIP Pro Glow */}
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className={`flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-xl border transition shrink-0 shadow-xs active:scale-95 cursor-pointer ${
            currentUser && currentUser.provider !== 'guest'
              ? 'bg-zinc-900 hover:bg-zinc-850 border-zinc-750 hover:border-zinc-650 text-zinc-100'
              : 'bg-emerald-950/60 hover:bg-emerald-900/60 border-emerald-700 text-emerald-300'
          }`}
          title={
            currentUser && currentUser.provider !== 'guest'
              ? (lang === 'ar' ? `حساب معتمد: ${currentUser.name} (${userPlan})` : `Verified: ${currentUser.name} (${userPlan})`)
              : (lang === 'ar' ? 'تسجيل الدخول وإدارة الأمان' : 'Sign In & Security')
          }
        >
          {/* Official Avatar with VIP Pro Ring & Provider Badge */}
          <div className="relative shrink-0">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces'}
              alt="Avatar"
              className={`w-6 h-6 rounded-full object-cover shrink-0 ${
                userPlan && !userPlan.includes('Free') && !userPlan.includes('مجاني')
                  ? 'ring-2 ring-amber-400/80 shadow-[0_0_8px_rgba(245,158,11,0.4)]'
                  : 'border border-zinc-700'
              }`}
            />
            {/* Official Provider Sub-Badge */}
            {currentUser?.provider === 'google' && (
              <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-white flex items-center justify-center shadow-xs">
                <svg className="w-2 h-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.7 12.3c0-.7-.1-1.4-.2-2H12v4.5h6.6c-.3 1.5-1.1 2.8-2.4 3.7v3h3.9c2.3-2.1 3.6-5.2 3.6-9.2z"/>
                  <path fill="#34A853" d="M12 24c3.2 0 6-1.1 7.9-2.9l-3.9-3c-1.1.7-2.5 1.2-4 1.2-3.1 0-5.8-2.1-6.7-4.9H1.3v3.1C3.3 21.4 7.3 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.3 14.3c-.3-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3V6.6H1.3C.5 8.2 0 10 0 12s.5 3.8 1.3 5.4l4-3.1z"/>
                  <path fill="#EA4335" d="M12 4.8c1.8 0 3.4.6 4.6 1.8l3.4-3.4C18 1.2 15.2 0 12 0 7.3 0 3.3 2.6 1.3 6.6l4 3.1c.9-2.8 3.6-4.9 6.7-4.9z"/>
                </svg>
              </span>
            )}
            {currentUser?.provider === 'apple' && (
              <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-black border border-zinc-700 flex items-center justify-center text-[7px] text-white">
                
              </span>
            )}
          </div>

          <div className="hidden lg:flex flex-col text-left text-[11px] leading-tight">
            <div className="flex items-center gap-1">
              <span className="font-bold truncate max-w-[85px]">
                {currentUser?.name || (lang === 'ar' ? 'سيف (Saif)' : 'Sign In')}
              </span>
              {currentUser?.verified && (
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              )}
            </div>
            {/* Pro Status Tag */}
            {userPlan && !userPlan.includes('Free') && !userPlan.includes('مجاني') && (
              <span className="text-[9px] font-mono text-zinc-300 font-bold px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700">
                {lang === 'ar' ? 'متقدم' : 'PRO'}
              </span>
            )}
          </div>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 transition shrink-0 shadow-xs"
          title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
        >
          {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        </button>
      </div>
    </header>
  );
};
